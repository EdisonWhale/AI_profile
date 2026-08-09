"use client";

import Link from "next/link";
import { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

interface SiteNavProps {
  className?: string;
}

const navItems = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About", hideOnMobile: true },
];

export function SiteNav({ className }: SiteNavProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const handleSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    if (!isHomePage) return;

    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) return;

    const navOffset = 72;
    const sectionTop =
      section.getBoundingClientRect().top + window.scrollY - navOffset;
    window.history.replaceState(null, "", `/#${sectionId}`);
    window.scrollTo({ top: sectionTop, behavior: "smooth" });
  };

  return (
    <header className={cn("quiet-nav", className)}>
      <div className="quiet-nav-inner">
        <Link href="/" className="quiet-nav-name">
          Edison Xu
        </Link>
        <nav className="quiet-nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={`/#${item.id}`}
              onClick={(event) => handleSectionClick(event, item.id)}
              data-mobile-hidden={item.hideOnMobile || undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/resume" data-mobile-hidden="true">
            Resume
          </Link>
          <Link href="/chat">Ask</Link>
        </nav>
        <ThemeToggle className="quiet-theme-toggle" />
      </div>
    </header>
  );
}
