'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  onSubmit: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSubmit,
  placeholder = "Ask me anything...",
  className,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.8, // After avatar animation
      },
    },
  };

  const inputVariants = {
    rest: {
      borderColor: "rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px var(--apple-shadow)",
    },
    focused: {
      borderColor: "var(--apple-tech-blue)",
      boxShadow: [
        "0 8px 32px var(--apple-shadow)",
        "0 0 0 3px rgba(0, 122, 255, 0.15)",
        "0 8px 32px var(--apple-shadow)",
      ],
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className={cn("w-full max-w-md", className)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <form onSubmit={handleSubmit}>
        <motion.div
          className="relative"
          animate={isFocused ? "focused" : "rest"}
          variants={inputVariants}
        >
          {/* Glass morphism container */}
          <div className="apple-glass relative overflow-hidden rounded-2xl">
            {/* Search icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Input field */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className={cn(
                "w-full bg-transparent pl-12 pr-12 py-4",
                "text-foreground placeholder:text-muted-foreground",
                "border-none outline-none",
                "text-base font-medium",
                "transition-all duration-200"
              )}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />

            {/* Submit button */}
            <motion.button
              type="submit"
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2",
                "p-2 rounded-xl",
                "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
                "shadow-lg shadow-blue-500/25",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                query.trim() ? "opacity-100" : "opacity-30"
              )}
              disabled={!query.trim()}
              whileHover={query.trim() ? { scale: 1.05 } : {}}
              whileTap={query.trim() ? { scale: 0.95 } : {}}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Focus glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              opacity: isFocused ? 1 : 0,
              scale: isFocused ? 1 : 0.95,
            }}
            transition={{ duration: 0.2 }}
            style={{
              background: "linear-gradient(45deg, transparent 30%, rgba(0, 122, 255, 0.1) 50%, transparent 70%)",
              filter: "blur(1px)",
            }}
          />
        </motion.div>
      </form>


    </motion.div>
  );
};

export default SearchInput;