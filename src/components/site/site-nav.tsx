"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Sparkles } from "lucide-react";

interface SiteNavProps {
  className?: string;
}

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Projects" },
  { id: "skills", label: "Capabilities" },
  { id: "contact", label: "Contact" },
];

export function SiteNav({ className }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (!isHomePage) {
      return;
    }

    event.preventDefault();

    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }

    const navOffset = 88;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY - navOffset;

    window.history.replaceState(null, "", `/#${sectionId}`);
    window.scrollTo({ top: sectionTop, behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "hero-nav fixed top-0 z-50 w-full",
        scrolled && "scrolled",
        className
      )}
    >
      <div className="content-width flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="nav-logo min-w-fit text-sm font-semibold tracking-[0.01em]"
        >
          Edison Xu
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={`/#${item.id}`}
              className="nav-link text-sm transition-colors"
              onClick={(event) => handleSectionClick(event, item.id)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions flex items-center gap-2">
          <ThemeToggle className="nav-secondary-btn" />
          <Link
            href="/chat"
            className="nav-primary-btn hidden items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium sm:inline-flex"
          >
            <Sparkles className="h-4 w-4" />
            Ask AI
          </Link>
          <Link
            href="/resume"
            className="nav-secondary-btn flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium"
          >
            Resume
          </Link>
        </div>
      </div>
    </header>
  );
}
