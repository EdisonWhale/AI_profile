'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  onSubmit: (query: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'hero';
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSubmit,
  placeholder = "Ask me anything...",
  className,
  variant = 'default',
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
    }
  };

  const isHero = variant === 'hero';

  return (
    <div className={cn("w-full max-w-3xl", className)}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col gap-3 rounded-2xl p-1.5 sm:flex-row sm:items-center",
          isHero
            ? "hero-search"
            : "ai-input-glow border border-input bg-card"
        )}
      >
        <label className="sr-only" htmlFor="ai-portfolio-search">
          Ask AI Edison a question
        </label>
        <div className="relative flex-1">
          <Sparkles className={cn(
            "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2",
            isHero ? "text-(--hero-muted)" : "text-brand/50"
          )} />
          <input
            id="ai-portfolio-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "w-full rounded-xl bg-transparent pl-10 pr-4 text-base focus:outline-none",
              isHero ? "h-14 text-(--hero-text)" : "h-12 text-foreground placeholder:text-muted-foreground"
            )}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        <Button
          type="submit"
          className={cn(
            "shrink-0 rounded-xl px-6",
            isHero ? "solid-ai-btn h-12" : "h-12"
          )}
          disabled={!query.trim()}
        >
          Ask AI
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default SearchInput;