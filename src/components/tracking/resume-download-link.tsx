"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { getTrackingSessionId } from "./session-id";

type ResumeDownloadLinkProps = ComponentPropsWithoutRef<"a">;

export function ResumeDownloadLink({ onClick, ...props }: ResumeDownloadLinkProps) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    try {
      void fetch("/api/tracking/resume-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getTrackingSessionId(),
          pathname: pathname || "/",
        }),
        keepalive: true,
        credentials: "same-origin",
      }).catch(() => undefined);
    } catch {
      // Analytics must never interfere with the browser's native download.
    }
  }

  return <a {...props} onClick={handleClick} />;
}
