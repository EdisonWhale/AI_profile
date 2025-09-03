'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isToolOrDynamicToolUIPart } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';

import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import { PresetReply } from '@/components/chat/preset-reply';
import { presetReplies } from '@/lib/config-loader';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import HelperBoost from './HelperBoost';

// Optimized ClientOnly component
const ClientOnly: React.FC<{ children: React.ReactNode }> = React.memo(function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
});

// Define Avatar component props interface
interface AvatarProps {
  hasActiveTool: boolean;
  isScrolled: boolean;
}

// Static Avatar component for better performance
const Avatar: React.FC<AvatarProps> = React.memo(function Avatar({ hasActiveTool, isScrolled }) {
  // Calculate size based on both hasActiveTool and scroll state with reduced variation
  const getAvatarSize = () => {
    if (isScrolled) return 64;
    return hasActiveTool ? 80 : 112;
  };

  // Animation variants for smoother transitions
  const avatarVariants = {
    center: {
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        duration: 0.3
      }
    },
    corner: {
      x: 0,
      y: 0, 
      scale: 0.57,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        duration: 0.3
      }
    }
  };

  const containerVariants = {
    center: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    },
    corner: {
      scale: 1,
      transition: {
        type: "spring", 
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      animate={isScrolled ? "corner" : "center"}
      className={`group relative flex items-center justify-center rounded-full`}
      style={{ 
        width: getAvatarSize(),
        height: getAvatarSize()
      }}
      title={isScrolled ? 'Back To Home Page' : undefined}
    >
      <motion.div
        variants={avatarVariants}
        animate={isScrolled ? "corner" : "center"}
        className="relative cursor-pointer"
        onClick={() => (window.location.href = '/')}
        whileHover={{ 
          scale: isScrolled ? 1.2 : 1.05,
          transition: { 
            type: "spring", 
            stiffness: 400, 
            damping: 15 
          }
        }}
        whileTap={{ 
          scale: 0.95,
          transition: { duration: 0.1 }
        }}
      >
        <img
          src="/avatar.png"
          alt="Avatar"
          className="h-full w-full object-cover object-[center_top_-5%] rounded-full apple-avatar-glow"
          style={{
            filter: isScrolled 
              ? 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12))' 
              : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.08))'
          }}
        />
        
        {/* Enhanced tooltip with motion */}
        <AnimatePresence>
          {isScrolled && (
            <motion.div 
              initial={{ opacity: 0, y: 5, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
              className="absolute -bottom-12 right-0 avatar-tooltip text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10"
            >
              Back to Home Page
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle glow effect for corner state */}
        {isScrolled && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-full bg-blue-400/20 blur-sm -z-10 group-hover:bg-blue-400/40 transition-all duration-300"
          />
        )}
      </motion.div>
    </motion.div>
  );
});

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
};

/**
 * Chat Component
 * 
 * Main chat interface for AI interaction
 * Supports initial query from URL parameters (?q=<encoded_query>)
 * 
 * @returns Interactive chat interface with AI
 */
const Chat: React.FC = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [presetReply, setPresetReply] = useState<{
    question: string;
    reply: string;
    tool: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Local state for input handling since it's no longer provided by useChat
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Create transport for AI SDK v5
  const transport = useMemo(() => new DefaultChatTransport({
    api: '/api/chat',
  }), []);

  const {
    messages,
    sendMessage,
    stop,
    regenerate,
    addToolResult,
    status,
  } = useChat({
    transport,
    onFinish: () => {
      setLoadingSubmit(false);
      setIsLoading(false);
    },
    onError: (error) => {
      setLoadingSubmit(false);
      setIsLoading(false);
      console.error('Chat error:', error.message, error.cause);
      
      // Handle specific error types
      if (error.message?.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        toast.error(`Error: ${error.message}`);
        setErrorMessage(`Error: ${error.message}`);
      }
    },
    onToolCall: ({ toolCall }) => {
      const toolName = toolCall.toolName;
      console.log('Tool call:', toolName);
    },
  });

  // Update isLoading based on status
  useEffect(() => {
    setIsLoading(status === 'streaming');
  }, [status]);

  // Lazy-initialized scroll handler
  const handleScroll = useCallback(() => {
    const scrollContainer = document.querySelector('.chat-scroll-container');
    if (!scrollContainer) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const viewportHeight = window.innerHeight;
    
    const isSmallScreen = viewportHeight < 700;
    const scrollThreshold = isSmallScreen ? 80 : 120;
    const scrollBuffer = isSmallScreen ? 30 : 50;
    
    const hasScrollableContent = scrollHeight > clientHeight + scrollBuffer;
    const newShouldBeScrolled = hasScrollableContent && scrollTop > scrollThreshold;
    
    if (newShouldBeScrolled !== isScrolled) {
      setIsScrolled(newShouldBeScrolled);
    }
  }, [isScrolled]);

  // Optimized debounced scroll handler
  const debouncedHandleScroll = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 16); // ~60fps
    };
  }, [handleScroll]);

  // Lazy scroll listener setup
  useEffect(() => {
    // Only setup scroll listener after initial render
    const timer = setTimeout(() => {
      const scrollContainer = document.querySelector('.chat-scroll-container');
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', debouncedHandleScroll, { passive: true });
        return () => scrollContainer.removeEventListener('scroll', debouncedHandleScroll);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [debouncedHandleScroll]);

  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex(
      (m) => m.role === 'assistant'
    );
    const latestUserMessageIndex = messages.findLastIndex(
      (m) => m.role === 'user'
    );

    const result = {
      currentAIMessage:
        latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
      latestUserMessage:
        latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
      hasActiveTool: false,
    };

    if (result.currentAIMessage) {
      result.hasActiveTool =
        result.currentAIMessage.parts?.some(
          (part) =>
            isToolOrDynamicToolUIPart(part) &&
            part.state === 'output-available'
        ) || false;
    }

    if (latestAIMessageIndex < latestUserMessageIndex) {
      result.currentAIMessage = null;
    }

    return result;
  }, [messages]);

  const isToolInProgress = status === 'streaming' || messages.some(
    (m) =>
      m.role === 'assistant' &&
      m.parts?.some(
        (part) =>
          isToolOrDynamicToolUIPart(part) &&
          part.state !== 'output-available'
      )
  );

  const submitQuery = useCallback((query: string) => {
    if (!query.trim() || isToolInProgress) return;
    
    setErrorMessage(null);
    
    setLoadingSubmit(true);
    setIsLoading(true);
    setPresetReply(null);
    sendMessage({
      text: query,
    });
  }, [isToolInProgress, sendMessage]);

  const submitQueryToAI = useCallback((query: string) => {
    if (!query.trim() || isToolInProgress) return;
    
    setErrorMessage(null);
    
    setLoadingSubmit(true);
    setIsLoading(true);
    setPresetReply(null);
    sendMessage({
      text: query,
    });
  }, [isToolInProgress, sendMessage]);


  const handleGetAIResponse = useCallback((question: string) => {
    setPresetReply(null);
    submitQueryToAI(question);
  }, [submitQueryToAI]);

  useEffect(() => {
    if (initialQuery && !autoSubmitted) {
      setAutoSubmitted(true);
      setInput('');
      submitQuery(initialQuery);
    }
  }, [initialQuery, autoSubmitted, submitQuery]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isToolInProgress) return;
    submitQueryToAI(input);
    setInput('');
  };

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
  };

  // Check if this is the initial empty state (no messages)
  const isEmptyState =
    !currentAIMessage && !latestUserMessage && !loadingSubmit && !presetReply && !errorMessage;

  // Calculate header height based on hasActiveTool and scroll state
  const headerHeight = useMemo(() => {
    if (isScrolled) return 80;
    return hasActiveTool ? 100 : 180;
  }, [hasActiveTool, isScrolled]);

  return (
    <div className="relative h-screen overflow-hidden apple-tech-bg">
      {/* Fixed Avatar Header with Gradient and CLS prevention */}
      <div
        className={`fixed top-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled 
            ? 'right-4 left-auto w-auto'
            : 'right-0 left-0 w-full'
        }`}
        style={{
          background: isScrolled 
            ? 'transparent'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%)',
          contain: 'layout style',
          willChange: 'transform, opacity',
        }}
      >
                  <div
            className={`transition-all duration-500 ease-in-out ${
              isScrolled 
                ? 'pt-4 pb-0'
                : hasActiveTool ? 'pt-6 pb-0' : 'py-6'
            }`}
          >
          <div className={`flex ${
            isScrolled ? 'justify-end' : 'justify-center'
          }`}>
            <ClientOnly>
              <Avatar
                hasActiveTool={hasActiveTool}
                isScrolled={isScrolled}
              />
            </ClientOnly>
          </div>

          <AnimatePresence>
            {latestUserMessage && !currentAIMessage && (
              <motion.div
                {...MOTION_CONFIG}
                className="mx-auto flex max-w-3xl px-4"
              >
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent
                      message={latestUserMessage}
                      isLast={true}
                      isLoading={false}
                      reload={regenerate}
                    />
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        {/* Scrollable Chat Content */}
        <div
          className="chat-scroll-container custom-scrollbar flex-1 overflow-y-auto px-2 pb-4"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-full items-center justify-center"
                {...MOTION_CONFIG}
              >
                <ChatLanding 
                  submitQuery={submitQuery} 
                />
              </motion.div>
            ) : presetReply ? (
              <div className="pb-4">
                <PresetReply
                  question={presetReply.question}
                  reply={presetReply.reply}
                  tool={presetReply.tool}
                  onGetAIResponse={handleGetAIResponse}
                  onClose={() => setPresetReply(null)}
                />
              </div>
            ) : errorMessage ? (
              <motion.div
                key="error"
                {...MOTION_CONFIG}
                className="px-4 pt-4"
              >
                <ChatBubble variant="received">
                  <ChatBubbleMessage className="apple-glass border-0 overflow-hidden">
                    <div className="relative p-6">
                      {/* Background subtle pattern with Apple colors */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr from-green-400 to-green-600 blur-2xl"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="relative space-y-5">
                        {/* Header with elegant icon */}
                        <motion.div
                          className="flex items-center gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1, duration: 0.4 }}
                        >
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            {/* Subtle glow ring */}
                            <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-pulse"></div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight">
                              Service Temporarily Unavailable
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              AI assistant is currently offline
                            </p>
                          </div>
                        </motion.div>
                        
                        {/* Professional explanation */}
                        <motion.div
                          className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          <p className="mb-3">
                            My AI assistant is experiencing technical difficulties and is temporarily unavailable. 
                            I apologize for any inconvenience this may cause.
                          </p>
                        </motion.div>
                        
                        {/* Enhanced action options */}
                        <motion.div
                          className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        >
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                            Alternative ways to connect:
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                              <span>Download my resume for detailed information</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              <span>Try the preset questions for immediate responses</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                              <span>Contact me directly for live consultation</span>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Apple-style action buttons */}
                        <motion.div
                          className="flex flex-col sm:flex-row gap-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                        >
                          <button
                            onClick={() => {
                              // Download resume
                              const link = document.createElement('a');
                              link.href = '/Edison-resume-2025.pdf';
                              link.download = 'Edison-Resume.pdf';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="flex-1 group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-600 hover:to-blue-700 apple-button-press"
                          >
                            <div className="relative flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Download Resume</span>
                            </div>
                            {/* Subtle hover glow */}
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                          </button>
                          
                          <button
                            onClick={() => {
                              setErrorMessage(null);
                              const preset = presetReplies["How can I reach you?"];
                              if (preset) {
                                setPresetReply({ 
                                  question: "How can I reach you?", 
                                  reply: preset.reply, 
                                  tool: preset.tool 
                                });
                              }
                            }}
                            className="flex-1 group relative bg-gray-100/80 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-xl font-medium text-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-200/80 dark:hover:bg-gray-700/50 transition-all duration-300 apple-button-press backdrop-blur-sm"
                          >
                            <div className="relative flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>Contact Me</span>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => {
                              setErrorMessage(null);
                              window.location.href = '/';
                            }}
                            className="flex-1 group text-gray-600 dark:text-gray-400 px-4 py-3 rounded-xl font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                          >
                            <div className="relative flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <span>Return Home</span>
                            </div>
                          </button>
                        </motion.div>
                        
                        {/* Professional footer note */}
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.4 }}
                        >
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                            Thank you for your understanding. I&apos;ll be back online shortly.
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            ) : currentAIMessage ? (
              <div className="pb-4">
                <SimplifiedChatView
                  message={currentAIMessage}
                  isLoading={isLoading}
                  reload={regenerate}
                  addToolResult={addToolResult}
                />
              </div>
            ) : (
              loadingSubmit && (
                <motion.div
                  key="loading"
                  {...MOTION_CONFIG}
                  className="px-4 pt-18"
                >
                  <ChatBubble variant="received">
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="sticky bottom-0 px-2 pt-3 md:px-0 md:pb-4">
          <div className="relative flex flex-col items-center gap-3">
            <HelperBoost 
              submitQuery={submitQuery}
            />
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={isToolInProgress}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;
