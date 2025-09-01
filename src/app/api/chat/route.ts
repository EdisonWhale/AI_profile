import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';

import { systemPrompt } from '@/lib/config-loader';
import { getContact } from './tools/getContact';
import { getEntryLevel } from './tools/getEntryLevel';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';

export const maxDuration = 30;

// Create Google AI provider with explicit API key
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});


export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('[CHAT-API] Incoming messages:', messages);
    
    // Check if API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('[CHAT-API] Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
      return new Response('Missing API key', { status: 500 });
    }
    
    console.log('[CHAT-API] API key available:', process.env.GOOGLE_GENERATIVE_AI_API_KEY?.slice(0, 10) + '...');

    // Add tools
    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getEntryLevel,
    };

    console.log('[CHAT-API] About to call streamText');
    
    const result = streamText({
      model: google('gemini-2.5-flash-lite'),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      tools,
    });

    console.log('[CHAT-API] streamText completed successfully');
    console.log('[CHAT-API] Result object keys:', Object.keys(result));
    
    const response = result.toUIMessageStreamResponse();
    console.log('[CHAT-API] UIMessageStreamResponse created');
    
    return response;
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
