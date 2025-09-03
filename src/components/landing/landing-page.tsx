'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AnimatedAvatar from './animated-avatar';
import SearchInput from './search-input';
import ActionButtons from './action-buttons';
import { getConfig } from '@/lib/config-loader';

interface LandingPageProps {
  className?: string;
}

/**
 * Landing Page Component
 * 
 * Main onboarding page with English content
 * Provides navigation to chat interface and resume download
 * 
 * @returns Landing page with avatar, search, and action buttons
 */
const LandingPage: React.FC<LandingPageProps> = () => {
  const router = useRouter();
  const config = getConfig();

  const handleSearchSubmit = (query: string) => {
    // Navigate to dedicated chat route with query
    const encodedQuery = encodeURIComponent(query);
    router.push(`/chat?q=${encodedQuery}`);
  };

  const handleChatClick = () => {
    // Navigate to dedicated chat route
    router.push('/chat');
  };

  const handleResumeDownload = () => {
    // Create download link for resume
    const resumeUrl = config.resume.downloadUrl || '/Edison-resume-2025.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `${config.personal.name}-Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen apple-tech-bg flex items-center justify-center p-6 pb-32"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Main container */}
      <div className="w-full max-w-lg mx-auto">
        <motion.div
          className="flex flex-col items-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {/* Welcome text */}
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Hello, I&apos;m {config.personal.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              {config.personal.title}
            </p>
          </motion.div>

          {/* Animated Avatar */}
          <AnimatedAvatar
            src={config.personal.avatar}
            size={120}
            showGlow={true}
          />

          {/* Search Input */}
          <SearchInput
            onSubmit={handleSearchSubmit}
            placeholder="Ask me anything..."
            className="w-full"
          />

          {/* Action Buttons */}
          <ActionButtons
            onChatClick={handleChatClick}
            onResumeDownload={handleResumeDownload}
            className="w-full"
          />

          {/* Status indicator */}
          <motion.div
            className="flex items-center gap-2 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.3 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-green-400"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span>{config.entryLevel.currentStatus}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, var(--apple-tech-blue) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, var(--apple-system-green) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </motion.div>
  );
};

export default LandingPage;