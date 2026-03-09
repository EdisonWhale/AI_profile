'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AnimatedAvatarProps {
  src: string;
  fallbackSrc?: string;
  size?: number;
  className?: string;
  showGlow?: boolean;
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
  src,
  fallbackSrc,
  size = 120,
  className,
  showGlow = true,
}) => {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <motion.div
      className={cn("relative", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        width: size,
        height: size,
      }}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-4xl border border-border bg-card transition-all duration-300",
          showGlow && "shadow-[0_20px_60px_rgba(15,15,15,0.06)] hover:shadow-[0_24px_72px_rgba(15,15,15,0.1)] hover:scale-[1.02]"
        )}
      >
        <Image
          src={hasImageError ? fallbackSrc || src : src}
          alt="Edison Xu"
          width={size * 2}
          height={size * 2}
          className="h-full w-full object-cover object-center"
          priority
          sizes={`${size}px`}
          onError={() => {
            if (!hasImageError && fallbackSrc) {
              setHasImageError(true);
            }
          }}
        />
      </div>

      {/* Subtle glow ring */}
      {showGlow && (
        <div
          className="pointer-events-none absolute -inset-1 -z-10 rounded-[2rem] opacity-40"
          style={{
            background: 'var(--ai-gradient)',
            filter: 'blur(20px)',
          }}
        />
      )}
    </motion.div>
  );
};

export default AnimatedAvatar;