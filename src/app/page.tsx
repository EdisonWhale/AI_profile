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
      <div className="flex min-h-screen items-center justify-center bg-(--hero-bg)">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-brand/20 border-t-brand animate-spin"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
