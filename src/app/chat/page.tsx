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
      <div className="min-h-screen apple-tech-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading chat interface...</p>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}