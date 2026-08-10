"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getTrackingSessionId } from "./session-id";

function valueOrNull(value: string | null, maxLength: number) {
  const normalized = value?.trim();
  return normalized && normalized.length <= maxLength ? normalized : null;
}

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/tracking")) return;
    let referrerHost: string | null = null;
    try {
      referrerHost = document.referrer ? new URL(document.referrer).host : null;
    } catch {
      referrerHost = null;
    }
    const body = JSON.stringify({
      sessionId: getTrackingSessionId(),
      pathname,
      referrerHost: valueOrNull(referrerHost, 255),
      utmSource: valueOrNull(searchParams.get("utm_source"), 100),
      utmMedium: valueOrNull(searchParams.get("utm_medium"), 100),
      utmCampaign: valueOrNull(searchParams.get("utm_campaign"), 160),
    });
    void fetch("/api/tracking/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => undefined);
  }, [pathname, searchParams]);

  return null;
}
