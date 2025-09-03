'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Download, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ActionButtonsProps {
  onChatClick: () => void;
  onResumeDownload: () => void;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onChatClick,
  onResumeDownload,
  className,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 1.0, // After input animation
        staggerChildren: 0.1,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2, // Faster button animation
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className={cn(
        "flex flex-col sm:flex-row gap-4 w-full max-w-md",
        className
      )}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Primary Button - Chat with AI */}
      <motion.div variants={buttonVariants} className="flex-1">
        <motion.button
          onClick={onChatClick}
          className={cn(
            "apple-glass apple-glow-hover apple-button-press",
            "w-full px-6 py-4 rounded-2xl",
            "flex items-center justify-center gap-3",
            "text-sm font-semibold",
            "text-gray-700 dark:text-gray-300",
            "transition-all duration-300 ease-out",
            "border border-white/30",
            "hover:border-blue-500/30",
            "group"
          )}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 0 30px var(--apple-glow)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <span> Meet AI Edison </span>
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </motion.button>
      </motion.div>

      {/* Secondary Button - Download Resume */}
      <motion.div variants={buttonVariants} className="flex-1">
        <motion.button
          onClick={onResumeDownload}
          className={cn(
            "apple-glass apple-glow-hover apple-button-press",
            "w-full px-6 py-4 rounded-2xl",
            "flex items-center justify-center gap-3",
            "text-sm font-medium",
            "text-gray-600 dark:text-gray-400",
            "transition-all duration-300 ease-out",
            "border border-white/20",
            "hover:border-green-500/30",
            "group"
          )}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 0 25px rgba(52, 199, 89, 0.15)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="h-5 w-5 text-green-500" />
          <span>Get Resume</span>
          <motion.div
            className="h-4 w-4 opacity-0 group-hover:opacity-100"
            initial={false}
            animate={{ 
              opacity: 0,
              x: -5,
            }}
            whileHover={{ 
              opacity: 1,
              x: 0,
              transition: { duration: 0.2 }
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ActionButtons;