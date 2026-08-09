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
      <div className="quiet-page flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading chat...</p>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
