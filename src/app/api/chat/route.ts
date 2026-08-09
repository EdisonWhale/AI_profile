import { createOpenAI } from "@ai-sdk/openai";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  convertToModelMessages,
  stepCountIs,
} from "ai";
import { z } from "zod";

import { systemPrompt } from "@/lib/config-loader";
import { getFallbackAnswer } from "./fallback";
import { getContact } from "./tools/getContact";
import { getEntryLevel } from "./tools/getEntryLevel";
import { getPresentation } from "./tools/getPresentation";
import { getProjects } from "./tools/getProjects";
import { getResume } from "./tools/getResume";
import { getSkills } from "./tools/getSkills";

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
});

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    "X-Title": "Edison AI Portfolio",
  },
});

const openrouterModel = process.env.OPENROUTER_MODEL || "minimax/minimax-m2.5";

function getClientIdentifier(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");

  return (
    forwardedFor?.split(",")[0]?.trim() || realIp || cfConnectingIp || "unknown"
  );
}

function isRateLimited(clientId: string) {
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

    const { messages } = parsedBody.data;
    const totalTextLength = getTotalTextLength(messages);

    if (totalTextLength > MAX_TEXT_CHARS) {
      return new Response(
        "Chat request is too large. Please shorten your message.",
        {
          status: 413,
        },
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.info("[CHAT-API] Using local portfolio fallback", {
        clientId,
        messageCount: messages.length,
        totalTextLength,
      });
      return createFallbackResponse(getLastUserText(messages));
    }

    console.info("[CHAT-API] Request accepted", {
      clientId,
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
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : "Unknown error",
    );

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
