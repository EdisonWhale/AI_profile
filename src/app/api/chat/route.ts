import { createOpenAI } from "@ai-sdk/openai";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  convertToModelMessages,
  stepCountIs,
} from "ai";
import { z } from "zod";
import { createHash } from "node:crypto";

import { systemPrompt } from "@/lib/config-loader";
import { getFallbackAnswer } from "./fallback";
import { getContact } from "./tools/getContact";
import { getEntryLevel } from "./tools/getEntryLevel";
import { getPresentation } from "./tools/getPresentation";
import { getProjects } from "./tools/getProjects";
import { getResume } from "./tools/getResume";
import { getSkills } from "./tools/getSkills";
import { getTrustedClientIp } from "@/lib/tracking/client-ip";
import { recordChatPrompt } from "@/lib/tracking/service";

export const maxDuration = 30;

const MAX_MESSAGES = 20;
const MAX_TEXT_CHARS = 12_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const chatRequestSchema = z.object({
  messages: z
    .array(
      z
        .object({
          id: z.string().optional(),
          role: z.enum(["system", "user", "assistant"]),
          parts: z
            .array(
              z
                .object({
                  type: z.string(),
                  text: z.string().optional(),
                })
                .passthrough(),
            )
            .default([]),
        })
        .passthrough(),
    )
    .min(1)
    .max(MAX_MESSAGES),
  trackingSessionId: z.string().uuid().optional(),
  trackingPathname: z.string().regex(/^\/[a-zA-Z0-9/_-]*$/).max(160).optional(),
});

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    "X-Title": "Edison AI Portfolio",
  },
});

const openrouterModel =
  process.env.OPENROUTER_MODEL || "openai/gpt-5.6-luna";

function getClientIdentifier(req: Request) {
  if (process.env.TRACKING_TRUST_PROXY !== "true") return null;
  return createHash("sha256")
    .update(getTrustedClientIp(req))
    .digest("hex");
}

function isRateLimited(clientId: string | null) {
  if (!clientId) return false;
  const now = Date.now();
  const current = rateLimitStore.get(clientId);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  rateLimitStore.set(clientId, current);

  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function getTotalTextLength(
  messages: z.infer<typeof chatRequestSchema>["messages"],
) {
  return messages.reduce((total, message) => {
    const messageText = message.parts.reduce((partTotal, part) => {
      if (part.type !== "text" || !part.text) {
        return partTotal;
      }

      return partTotal + part.text.length;
    }, 0);

    return total + messageText;
  }, 0);
}

function getLastUserText(
  messages: z.infer<typeof chatRequestSchema>["messages"],
) {
  const lastUserMessage = messages.findLast(
    (message) => message.role === "user",
  );

  return (
    lastUserMessage?.parts
      .filter(
        (part): part is typeof part & { text: string } =>
          part.type === "text" && typeof part.text === "string",
      )
      .map((part) => part.text)
      .join("\n") ?? ""
  );
}

function createFallbackResponse(question: string) {
  const answer = getFallbackAnswer(question);
  const textPartId = "fallback-answer";
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: "start" });
      writer.write({ type: "start-step" });
      writer.write({ type: "text-start", id: textPartId });
      writer.write({ type: "text-delta", id: textPartId, delta: answer });
      writer.write({ type: "text-end", id: textPartId });
      writer.write({ type: "finish-step" });
      writer.write({ type: "finish", finishReason: "stop" });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

export async function POST(req: Request) {
  try {
    const clientId = getClientIdentifier(req);
    if (isRateLimited(clientId)) {
      return new Response("Too many requests. Please try again in a minute.", {
        status: 429,
      });
    }

    const body = await req.json();
    const parsedBody = chatRequestSchema.safeParse(body);

    if (!parsedBody.success) {
      return new Response("Invalid chat request payload.", { status: 400 });
    }

    const { messages, trackingSessionId, trackingPathname } = parsedBody.data;
    const totalTextLength = getTotalTextLength(messages);

    if (totalTextLength > MAX_TEXT_CHARS) {
      return new Response(
        "Chat request is too large. Please shorten your message.",
        {
          status: 413,
        },
      );
    }

    const lastUserText = getLastUserText(messages).trim();
    if (trackingSessionId && lastUserText) {
      recordChatPrompt(req, {
        sessionId: trackingSessionId,
        pathname: trackingPathname ?? "/chat",
        prompt: lastUserText,
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.info("[CHAT-API] Using local portfolio fallback", {
        messageCount: messages.length,
        totalTextLength,
      });
      return createFallbackResponse(lastUserText);
    }

    console.info("[CHAT-API] Request accepted", {
      messageCount: messages.length,
      totalTextLength,
      model: openrouterModel,
    });

    // Add tools
    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getEntryLevel,
    };

    const baseConfig = {
      system: systemPrompt,
      messages: convertToModelMessages(
        messages as Parameters<typeof convertToModelMessages>[0],
      ),
      tools,
      stopWhen: stepCountIs(5),
    };

    const result = streamText({
      model: openrouter.chat(openrouterModel),
      ...baseConfig,
      providerOptions: {
        openai: {
          reasoningEffort: "medium",
        },
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[CHAT-API] Request failed");

    if (error instanceof Error && error.message?.includes("network")) {
      return new Response(
        "Network error. Please check your connection and try again.",
        { status: 503 },
      );
    }

    return new Response("Internal Server Error. Please try again later.", {
      status: 500,
    });
  }
}
