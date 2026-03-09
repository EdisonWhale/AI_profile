"use client";

import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

type ThemeMode = "light" | "dark";

const themeMeta: Record<ThemeMode, { label: string; icon: typeof SunMedium }> = {
  light: {
    label: "Light",
    icon: SunMedium,
  },
  dark: {
    label: "Dark",
    icon: Moon,
  },
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = useMemo<ThemeMode>(() => {
    if (!mounted) {
      return "dark";
    }

    return resolvedTheme === "light" ? "light" : "dark";
  }, [mounted, resolvedTheme]);

  const nextTheme: ThemeMode = activeTheme === "dark" ? "light" : "dark";
  const ActiveIcon = themeMeta[activeTheme].icon;

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      className={cn(
        "glass-btn inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium",
        className
      )}
    >
      <ActiveIcon className="h-4 w-4" />
      <span className="hidden sm:inline">{themeMeta[activeTheme].label} mode</span>
      <span className="sm:hidden">{themeMeta[activeTheme].label}</span>
    </button>
  );
}
