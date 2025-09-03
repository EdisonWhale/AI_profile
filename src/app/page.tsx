'use client';

import { Suspense } from 'react';
import LandingPage from '@/components/landing/landing-page';

function HomeContent() {
  return <LandingPage />;
}

/**
 * Home Page Component
 * 
 * Renders the landing page at root route (/)
 * Chat functionality has been moved to dedicated /chat route
 * 
 * @returns Landing page with navigation to chat interface
 */
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen apple-tech-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
