import { cn } from "@/lib/utils";
import * as React from "react";

interface SectionShellProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  tinted?: boolean;
  children: React.ReactNode;
}

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  className,
  headerClassName,
  tinted = false,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "section-padding",
        tinted && "section-tinted",
        className
      )}
    >
      <div className="content-width">
        <div
          className={cn(
            "mb-12 max-w-3xl space-y-4 md:mb-16",
            headerClassName
          )}
        >
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="section-title">{title}</h2>
          {description ? <p className="section-copy">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
