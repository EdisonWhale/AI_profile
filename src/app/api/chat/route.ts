import { createOpenAI } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, stepCountIs } from 'ai';

import { systemPrompt } from '@/lib/config-loader';
import { getContact } from './tools/getContact';
import { getEntryLevel } from './tools/getEntryLevel';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';

export const maxDuration = 30;

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    'X-Title': 'Edison AI Portfolio',
  },
});

const openrouterModel = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash-lite';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('[CHAT-API] Incoming messages:', messages);

    if (!process.env.OPENROUTER_API_KEY) {
      console.error('[CHAT-API] Missing OPENROUTER_API_KEY environment variable');
      return new Response('Missing API key', { status: 500 });
    }

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
      messages: convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(5),
    };

    console.log('[CHAT-API] Provider decision: OpenRouter');
    const result = streamText({
      model: openrouter(openrouterModel),
      ...baseConfig,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Handle specific error types
    
    if (error instanceof Error && error.message?.includes('network')) {
      return new Response('Network error. Please check your connection and try again.', { status: 503 });
    }
    
    return new Response(`Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
