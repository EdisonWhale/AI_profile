import "server-only";

import { getDeviceDetails, getTrustedClientIp, isBotRequest } from "./client-ip";
import { encryptTrackingValue, hashIp } from "./crypto";
import { getRetentionDays, isTrackingEnabled } from "./config";
import { enrichSessionFromIpinfo } from "./ip-enrichment";
import { cleanupExpiredTracking, writeTrackingEvent } from "./repository";
import { hasValidTrackingAdminRequest } from "./auth";

const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;
let lastCleanupAt = 0;
const pageViewRateLimits = new Map<string, { count: number; resetAt: number }>();
const PAGE_VIEW_RATE_LIMIT_WINDOW_MS = 60_000;
const PAGE_VIEW_RATE_LIMIT_MAX = 120;

type PageViewInput = {
  sessionId: string;
  pathname: string;
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

function record(input: Omit<PageViewInput, "referrerHost" | "utmSource" | "utmMedium" | "utmCampaign"> & {
  request: Request;
  eventType: "page_view" | "chat_prompt" | "resume_download";
  referrerHost?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  prompt?: string;
  chatOutcome?: string;
}) {
  if (
    !isTrackingEnabled() ||
    input.pathname.startsWith("/tracking") ||
    hasValidTrackingAdminRequest(input.request)
  ) return;
  const ip = getTrustedClientIp(input.request);
  const { deviceType, browserFamily } = getDeviceDetails(input.request);
  const isBot = isBotRequest(input.request);
  if (isBot) return;
  const createdAt = Date.now();

  try {
    const result = writeTrackingEvent({
      sessionId: input.sessionId,
      ipHash: hashIp(ip),
      ipCiphertext: encryptTrackingValue(ip),
      deviceType,
      browserFamily,
      isBot: false,
      isInternal: false,
      eventType: input.eventType,
      pathname: input.pathname,
      referrerHost: input.referrerHost,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      promptCiphertext: input.prompt ? encryptTrackingValue(input.prompt) : null,
      promptLength: input.prompt?.length ?? null,
      chatOutcome: input.chatOutcome ?? "accepted",
    });
    if (result.isNewSession && !result.hasCachedEnrichment && ip !== "unknown") {
      void enrichSessionFromIpinfo(input.sessionId, ip);
    }
    if (createdAt - lastCleanupAt > CLEANUP_INTERVAL_MS) {
      cleanupExpiredTracking(getRetentionDays());
      lastCleanupAt = createdAt;
    }
  } catch {
    // Analytics must never become a dependency of the visitor experience.
  }
}

function isPageViewRateLimited(request: Request) {
  const now = Date.now();
  let key: string | null = null;
  try {
    const ip = getTrustedClientIp(request);
    key = ip === "unknown" ? null : hashIp(ip);
  } catch {
    // If configuration is broken, fail closed for collection but never for the page.
  }
  if (!key) return false;
  const existing = pageViewRateLimits.get(key);
  if (!existing || existing.resetAt <= now) {
    if (pageViewRateLimits.size > 10_000) pageViewRateLimits.clear();
    pageViewRateLimits.set(key, { count: 1, resetAt: now + PAGE_VIEW_RATE_LIMIT_WINDOW_MS });
    return false;
  }
  existing.count += 1;
  return existing.count > PAGE_VIEW_RATE_LIMIT_MAX;
}

export function recordPageView(request: Request, input: PageViewInput) {
  if (hasValidTrackingAdminRequest(request) || isPageViewRateLimited(request)) return;
  record({ request, eventType: "page_view", ...input });
}

export function recordChatPrompt(
  request: Request,
  input: { sessionId: string; pathname: string; prompt: string; chatOutcome?: string },
) {
  record({ request, eventType: "chat_prompt", ...input });
}

export function recordResumeDownload(
  request: Request,
  input: { sessionId: string; pathname: string },
) {
  if (hasValidTrackingAdminRequest(request) || isResumeDownloadRateLimited(request)) return;
  record({ request, eventType: "resume_download", ...input });
}

const resumeDownloadRateLimits = new Map<string, { count: number; resetAt: number }>();
const RESUME_DOWNLOAD_RATE_LIMIT_WINDOW_MS = 60_000;
const RESUME_DOWNLOAD_RATE_LIMIT_MAX = 20;

function isResumeDownloadRateLimited(request: Request) {
  let key: string | null = null;
  try {
    const ip = getTrustedClientIp(request);
    key = ip === "unknown" ? null : hashIp(ip);
  } catch {
    return false;
  }
  if (!key) return false;
  const now = Date.now();
  const existing = resumeDownloadRateLimits.get(key);
  if (!existing || existing.resetAt <= now) {
    if (resumeDownloadRateLimits.size > 10_000) resumeDownloadRateLimits.clear();
    resumeDownloadRateLimits.set(key, { count: 1, resetAt: now + RESUME_DOWNLOAD_RATE_LIMIT_WINDOW_MS });
    return false;
  }
  existing.count += 1;
  return existing.count > RESUME_DOWNLOAD_RATE_LIMIT_MAX;
}
