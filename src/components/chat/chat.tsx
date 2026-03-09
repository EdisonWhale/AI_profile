'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isToolOrDynamicToolUIPart } from 'ai';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import { PresetReply } from '@/components/chat/preset-reply';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { getConfig, presetReplies } from '@/lib/config-loader';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import HelperBoost from './HelperBoost';

// ClientOnly component for client-side rendering
interface ClientOnlyProps {
  children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Define Avatar component props interface
interface AvatarProps {
  hasActiveTool: boolean;
  isScrolled: boolean;
  avatarSrc: string;
  fallbackSrc: string;
}

// Dynamic import of Avatar component
const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ hasActiveTool, isScrolled, avatarSrc, fallbackSrc }: AvatarProps) => {
      // Calculate size based on both hasActiveTool and scroll state with reduced variation
      const getAvatarSize = () => {
        if (isScrolled) return 64;
        return hasActiveTool ? 80 : 112;
      };

      // Animation variants for smoother transitions
      const avatarVariants: Variants = {
        center: {
          x: 0,
          y: 0,
          scale: 1,
          transition: {
            type: "spring" as const,
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
            type: "spring" as const,
            stiffness: 300,
            damping: 30,
            mass: 0.8,
            duration: 0.3
          }
        }
      };

      const containerVariants: Variants = {
        center: {
          scale: 1,
          transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 30,
            duration: 0.3
          }
        },
        corner: {
          scale: 1,
          transition: {
            type: "spring" as const, 
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
          <motion.button
            type="button"
            variants={avatarVariants}
            animate={isScrolled ? "corner" : "center"}
            className="relative cursor-pointer border-0 bg-transparent p-0"
            onClick={() => (window.location.href = '/')}
            aria-label="Return to home page"
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
            <Image
              src={avatarSrc}
              alt="Avatar"
              width={getAvatarSize()}
              height={getAvatarSize()}
              className="h-full w-full object-cover object-[center_top_-5%] rounded-full apple-avatar-glow"
              style={{
                filter: isScrolled 
                  ? 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12))' 
                  : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.08))'
              }}
              onError={(event) => {
                event.currentTarget.src = fallbackSrc;
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
                  className="avatar-tooltip pointer-events-none absolute -bottom-12 right-0 z-10 rounded-lg px-3 py-2 text-(--panel-body-strong) text-xs opacity-0 transition-opacity duration-200 whitespace-nowrap group-hover:opacity-100"
                >
                  Back to Home Page
                  <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 bg-surface"></div>
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
          </motion.button>
        </motion.div>
      );
    }),
  { ssr: false }
);

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut' as const,
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
  const config = getConfig();
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
  const requestInFlightRef = useRef(false);

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
      requestInFlightRef.current = false;
      setLoadingSubmit(false);
      setIsLoading(false);
    },
    onError: (error) => {
      requestInFlightRef.current = false;
      setLoadingSubmit(false);
      setIsLoading(false);
      
      // Handle specific error types
      if (error.message?.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        toast.error(`Error: ${error.message}`);
        setErrorMessage(`Error: ${error.message}`);
      }
    },
  });

  // Update isLoading based on status
  useEffect(() => {
    setIsLoading(status === 'streaming');
  }, [status]);

  // Enhanced scroll detection with improved stability for small screens
  const handleScroll = useCallback(() => {
    const scrollContainer = document.querySelector('.chat-scroll-container');
    if (scrollContainer) {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      const viewportHeight = window.innerHeight;
      
      const isSmallScreen = viewportHeight < 700;
      const scrollBuffer = isSmallScreen ? 30 : 50;
      const scrollThreshold = isSmallScreen ? 80 : 120;
      
      const hasScrollableContent = scrollHeight > clientHeight + scrollBuffer;
      
      const currentThreshold = isScrolled ? scrollThreshold - 20 : scrollThreshold;
      const newShouldBeScrolled = hasScrollableContent && scrollTop > currentThreshold;
      
      if (newShouldBeScrolled !== isScrolled) {
        setIsScrolled(newShouldBeScrolled);
      }
    }
  }, [isScrolled]);

  // Enhanced debouncing with better performance
  const debouncedHandleScroll = useCallback(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let ticking = false;
    
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (timeoutId) clearTimeout(timeoutId);
          
          timeoutId = setTimeout(() => {
            handleScroll();
            ticking = false;
          }, 30);
        });
        ticking = true;
      }
    };
  }, [handleScroll]);

  // Setup scroll listener with enhanced cleanup
  useEffect(() => {
    const scrollContainer = document.querySelector('.chat-scroll-container');
    const debouncedScroll = debouncedHandleScroll();
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', debouncedScroll, { passive: true });
      
      return () => {
        scrollContainer.removeEventListener('scroll', debouncedScroll);
      };
    }
  }, [debouncedHandleScroll]);

  const { lastAssistantMessageIndex, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex((m) => m.role === 'assistant');
    const latestAIMessage =
      latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null;

    return {
      lastAssistantMessageIndex: latestAIMessageIndex,
      hasActiveTool:
        latestAIMessage?.parts?.some(
          (part) =>
            isToolOrDynamicToolUIPart(part) &&
            part.state === 'output-available'
        ) || false,
    };
  }, [messages]);

  // Block sends when: streaming, submitted (waiting for stream), or tools still running.
  // requestInFlightRef (checked in callbacks) guards against AI SDK "Cannot read properties of undefined (reading 'state')" when sendMessage is called before previous request finishes.
  const isRequestInFlight =
    status === 'streaming' ||
    status === 'submitted' ||
    messages.some(
      (m) =>
        m.role === 'assistant' &&
        m.parts?.some(
          (part) =>
            isToolOrDynamicToolUIPart(part) &&
            part.state !== 'output-available'
        )
    );

  const submitQuery = useCallback(
    (query: string) => {
      if (!query.trim()) return;
      if (requestInFlightRef.current || status === 'streaming' || status === 'submitted') return;
      if (
        messages.some(
          (m) =>
            m.role === 'assistant' &&
            m.parts?.some(
              (part) =>
                isToolOrDynamicToolUIPart(part) &&
                part.state !== 'output-available'
            )
        )
      )
        return;

      setErrorMessage(null);
      setLoadingSubmit(true);
      setIsLoading(true);
      setPresetReply(null);
      requestInFlightRef.current = true;
      sendMessage({ text: query });
    },
    [status, messages, sendMessage]
  );

  const submitQueryToAI = useCallback(
    (query: string) => {
      if (!query.trim()) return;
      if (requestInFlightRef.current || status === 'streaming' || status === 'submitted') return;
      if (
        messages.some(
          (m) =>
            m.role === 'assistant' &&
            m.parts?.some(
              (part) =>
                isToolOrDynamicToolUIPart(part) &&
                part.state !== 'output-available'
            )
        )
      )
        return;

      setErrorMessage(null);
      setLoadingSubmit(true);
      setIsLoading(true);
      setPresetReply(null);
      requestInFlightRef.current = true;
      sendMessage({ text: query });
    },
    [status, messages, sendMessage]
  );


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
    if (!input.trim() || isRequestInFlight) return;
    submitQueryToAI(input);
    setInput('');
  };

  const handleStop = () => {
    requestInFlightRef.current = false;
    stop();
    setLoadingSubmit(false);
    setIsLoading(false);
  };

  // Check if this is the initial empty state (no messages)
  const isEmptyState =
    messages.length === 0 && !loadingSubmit && !presetReply && !errorMessage;

  // Calculate header height based on hasActiveTool and scroll state
  const headerHeight = useMemo(() => {
    if (isScrolled) return 80;
    return hasActiveTool ? 100 : 180;
  }, [hasActiveTool, isScrolled]);

  return (
    <div className="chat-page relative h-screen overflow-hidden">
      <div className="pointer-events-none fixed top-4 right-4 z-60">
        <ThemeToggle className="pointer-events-auto chat-theme-toggle" />
      </div>

      {/* Fixed Avatar Header with Gradient and CLS prevention */}
      <div
        className={`fixed z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'top-[4.75rem] right-4 left-auto w-auto'
            : 'top-0 right-0 left-0 w-full chat-header-gradient'
        }`}
        style={{
          background: isScrolled 
            ? 'transparent'
            : undefined,
          contain: 'layout style',
          willChange: 'transform, opacity',
        }}
      >
          <div
            className={`transition-all duration-500 ease-in-out ${
              isScrolled
                ? 'pt-0 pb-0'
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
                avatarSrc={config.personal.avatar}
                fallbackSrc={config.personal.fallbackAvatar}
              />
            </ClientOnly>
          </div>

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
            ) : (
              <div className="space-y-4 pb-4">
                {messages.map((message, index) =>
                  message.role === 'user' ? (
                    <motion.div
                      key={`${message.role}-${message.id ?? index}`}
                      {...MOTION_CONFIG}
                      className="mx-auto flex max-w-3xl px-4"
                    >
                      <ChatBubble variant="sent">
                        <ChatBubbleMessage>
                          <ChatMessageContent
                            message={message}
                            isLast={true}
                            isLoading={false}
                            reload={regenerate}
                          />
                        </ChatBubbleMessage>
                      </ChatBubble>
                    </motion.div>
                  ) : message.role === 'assistant' ? (
                    <div key={`${message.role}-${message.id ?? index}`}>
                      <SimplifiedChatView
                        message={message}
                        isLoading={isLoading && index === lastAssistantMessageIndex}
                        reload={regenerate}
                        addToolResult={addToolResult}
                      />
                    </div>
                  ) : null
                )}

                {loadingSubmit && lastAssistantMessageIndex === -1 && (
                  <motion.div
                    key="loading"
                    {...MOTION_CONFIG}
                    className="px-4 pt-18"
                  >
                    <ChatBubble variant="received">
                      <ChatBubbleMessage isLoading />
                    </ChatBubble>
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    key="error"
                    {...MOTION_CONFIG}
                    className="px-4 pt-4"
                  >
                    <ChatBubble variant="received">
                      <ChatBubbleMessage className="surface-card overflow-hidden backdrop-blur-md">
                        <div className="relative p-6">
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-linear-to-br from-brand-blue to-purple-600 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-linear-to-tr from-brand-purple to-purple-400 blur-2xl"></div>
                          </div>
                          <div className="relative space-y-5">
                            <motion.div
                              className="flex items-center gap-4"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1, duration: 0.4 }}
                            >
                              <div className="relative">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-200/80 bg-linear-to-br from-violet-100 via-white to-indigo-100 text-violet-700 shadow-[0_8px_22px_rgba(139,92,246,0.16)] dark:border-white/10 dark:bg-linear-to-br dark:from-violet-500/24 dark:via-indigo-500/14 dark:to-slate-900 dark:text-violet-100 dark:shadow-[0_0_15px_rgba(168,85,247,0.28)]">
                                  <svg className="h-6 w-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div className="absolute inset-0 rounded-full bg-violet-300/30 blur-[1px] animate-pulse dark:bg-violet-400/16"></div>
                              </div>
                              <div className="flex-1">
                                <h3 className="section-heading text-base leading-tight">
                                  Service Temporarily Unavailable
                                </h3>
                                <p className="section-body mt-1 text-sm">
                                  AI assistant is currently offline
                                </p>
                              </div>
                            </motion.div>
                            <motion.div
                              className="section-body text-sm leading-relaxed"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2, duration: 0.4 }}
                            >
                              <p className="mb-3">
                                My AI assistant is experiencing technical difficulties and is temporarily unavailable.
                                I apologize for any inconvenience this may cause.
                              </p>
                            </motion.div>
                            <motion.div
                              className="surface-panel rounded-xl p-4"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.4 }}
                            >
                              <p className="text-(--panel-body-strong) mb-3 text-sm font-medium">
                                Alternative ways to connect:
                              </p>
                              <div className="space-y-2">
                                <div className="section-body flex items-center gap-3 text-xs">
                                  <div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div>
                                  <span>Open my resume preview for detailed information</span>
                                </div>
                                <div className="section-body flex items-center gap-3 text-xs">
                                  <div className="w-1.5 h-1.5 rounded-full bg-brand-purple"></div>
                                  <span>Try the preset questions for immediate responses</span>
                                </div>
                                <div className="section-body flex items-center gap-3 text-xs">
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                  <span>Contact me directly for live consultation</span>
                                </div>
                              </div>
                            </motion.div>
                            <motion.div
                              className="flex flex-col sm:flex-row gap-3"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4, duration: 0.4 }}
                            >
                              <button
                                onClick={() => {
                                  window.open(config.resume.downloadUrl, '_blank', 'noopener,noreferrer');
                                }}
                                className="flex-1 group relative overflow-hidden bg-linear-to-r from-brand-blue to-purple-600 text-white px-4 py-3 rounded-xl font-medium text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-[1.02] apple-button-press"
                              >
                                <div className="relative flex items-center justify-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span>Open Resume</span>
                                </div>
                                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
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
                                className="glass-btn apple-button-press text-(--panel-body-strong) relative flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 backdrop-blur-sm"
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
                                className="text-(--panel-body) hover:text-(--panel-body-strong) group flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-surface-subtle"
                              >
                                <div className="relative flex items-center justify-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                  <span>Return Home</span>
                                </div>
                              </button>
                            </motion.div>
                            <motion.div
                              className="text-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6, duration: 0.4 }}
                            >
                              <p className="section-body text-xs font-light">
                                Thank you for your understanding. I&apos;ll be back online shortly.
                              </p>
                            </motion.div>
                          </div>
                        </div>
                      </ChatBubbleMessage>
                    </ChatBubble>
                  </motion.div>
                )}
              </div>
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
              isToolInProgress={isRequestInFlight}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chat;
