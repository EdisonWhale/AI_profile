"use client";

export default function TrackingError({ reset }: { reset: () => void }) {
  return <div className="tracking-shell tracking-error-state"><p className="tracking-eyebrow">PRIVATE ANALYTICS</p><h1>Data is temporarily unavailable.</h1><p>The dashboard could not be loaded. No visitor data was exposed.</p><button type="button" onClick={reset} className="tracking-primary-button">Try again</button></div>;
}
