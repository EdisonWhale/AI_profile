'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AnimatedAvatarProps {
  src: string;
  fallbackSrc?: string;
  size?: number;
  className?: string;
  showGlow?: boolean;
}

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
  src,

  size = 120,
  className,
  showGlow = true,
}) => {
  // Flash animation variants
  const flashVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)",
    },
    flash: {
      opacity: 1,
      scale: 1.1,
      filter: "blur(0px) drop-shadow(0 0 30px var(--apple-glow))",
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    stable: {
      opacity: 1,
      scale: 1,
      filter: showGlow 
        ? "blur(0px) drop-shadow(0 0 20px var(--apple-glow))" 
        : "blur(0px)",
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2,
      },
    },
  };

  // Continuous glow animation
  const glowVariants = {
    glow: {
      filter: [
        "drop-shadow(0 0 20px var(--apple-glow))",
        "drop-shadow(0 0 25px var(--apple-glow))",
        "drop-shadow(0 0 20px var(--apple-glow))",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className={cn("relative", className)}
      initial="hidden"
      animate={["flash", "stable"]}
      style={{
        width: size,
        height: size,
      }}
    >
      <motion.div
        variants={flashVariants}
        className="relative"
      >
        <Avatar 
          className={cn(
            "apple-avatar-glow border-2 border-white/20",
            showGlow && "apple-glow"
          )}
          style={{
            width: size,
            height: size,
          }}
        >
          <AvatarImage 
            src={src} 
            alt="Edison Xu"
            className="object-cover"
          />
          <AvatarFallback 
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold"
          >
            EX
          </AvatarFallback>
        </Avatar>
        
        {showGlow && (
          <motion.div
            className="absolute inset-0 rounded-full"
            variants={glowVariants}
            animate="glow"
            style={{
              background: "radial-gradient(circle, var(--apple-glow) 0%, transparent 70%)",
              zIndex: -1,
            }}
          />
        )}
      </motion.div>
      
      {/* Status indicator */}
      <motion.div
        className="absolute -bottom-1 -right-1 apple-status-dot rounded-full"
        style={{ width: 12, height: 12 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      />
    </motion.div>
  );
};

export default AnimatedAvatar;