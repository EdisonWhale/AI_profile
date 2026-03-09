'use client';

import { Suspense } from 'react';
import Chat from '@/components/chat/chat';

function ChatPageContent() {
  return <Chat />;
}

/**
 * Chat Page Component
 * 
 * Dedicated route for chat interface (/chat)
 * Supports query parameter for initial message (?q=<encoded_query>)
 * 
 * @example
 * /chat - Empty chat interface
 * /chat?q=Hello - Chat with initial "Hello" message
 */
export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="chat-page flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div>
          <p className="text-(--hero-muted) text-sm">Loading chat interface...</p>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}