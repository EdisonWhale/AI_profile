'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, isToolOrDynamicToolUIPart } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
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
}

// Dynamic import of Avatar component
const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ hasActiveTool, isScrolled }: AvatarProps) => {
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
    }),
  { ssr: false }
);

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

  // Enhanced scroll detection with improved stability for small screens
  const handleScroll = useCallback(() => {
    const scrollContainer = document.querySelector('.chat-scroll-container');
    if (scrollContainer) {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      const viewportHeight = window.innerHeight;
      
      // More stable threshold calculation for small screens
      const isSmallScreen = viewportHeight < 700;
      const scrollBuffer = isSmallScreen ? 30 : 50; // Smaller buffer for small screens
      const scrollThreshold = isSmallScreen ? 80 : 120; // Lower threshold for small screens
      
      // Only trigger if there's actual scrollable content
      const hasScrollableContent = scrollHeight > clientHeight + scrollBuffer;
      const shouldBeScrolled = hasScrollableContent && scrollTop > scrollThreshold;
      
      // Add hysteresis to prevent rapid state changes
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
          
          // Shorter debounce for more responsive behavior
          timeoutId = setTimeout(() => {
            handleScroll();
            ticking = false;
          }, 30); // Reduced from 50ms to 30ms
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
    
    // Clear any previous error message
    setErrorMessage(null);
    
    // Default to AI response - preset checking removed
    setLoadingSubmit(true);
    setIsLoading(true);
    setPresetReply(null); // Clear any preset reply when submitting new query
    sendMessage({
      text: query,
    });
  }, [isToolInProgress, sendMessage]);

  const submitQueryToAI = useCallback((query: string) => {
    if (!query.trim() || isToolInProgress) return;
    
    // Clear any previous error message
    setErrorMessage(null);
    
    // Force AI response, bypass preset checking
    setLoadingSubmit(true);
    setIsLoading(true);
    setPresetReply(null);
    sendMessage({
      text: query,
    });
  }, [isToolInProgress, sendMessage]);

  const handlePresetReply = (question: string, reply: string, tool: string) => {
    setPresetReply({ question, reply, tool });
    setLoadingSubmit(false);
  };

  const handleGetAIResponse = useCallback((question: string) => {
    setPresetReply(null);
    submitQueryToAI(question); // Use the new function that bypasses presets
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
    submitQueryToAI(input); // User input should go directly to AI
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
    if (isScrolled) return 80; // Minimal height when scrolled
    return hasActiveTool ? 100 : 180;
  }, [hasActiveTool, isScrolled]);

  return (
    <div className="relative h-screen overflow-hidden apple-tech-bg">
      {/* Fixed Avatar Header with Gradient and CLS prevention */}
      <div
        className={`fixed top-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled 
            ? 'right-4 left-auto w-auto' // Top-right corner when scrolled
            : 'right-0 left-0 w-full'    // Full width when not scrolled
        }`}
        style={{
          background: isScrolled 
            ? 'transparent' // No gradient when in corner
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%)',
          contain: 'layout style', // Prevent layout shifts
          willChange: 'transform, opacity', // Optimize for animations
        }}
      >
        <div
          className={`transition-all duration-500 ease-in-out ${
            isScrolled 
              ? 'pt-4 pb-0' // Minimal padding when scrolled
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
                  <ChatBubbleMessage className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="space-y-4 p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                          <span className="text-white text-lg">⚠️</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                            API Quota Exhausted
                          </h3>
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            Free Gemini API limit reached
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
                        <p>
                          Hi! I&apos;m currently using the <strong>free version</strong> of Google&apos;s Gemini API, 
                          and today&apos;s quota has been reached.
                        </p>
                        
                        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg mt-3">
                          <p className="font-medium mb-2">What you can do:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Contact me directly for a live demo</li>
                            <li>Use the preset questions below for instant responses</li>
                            <li>Come back tomorrow when the quota resets</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
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
                          className="px-4 py-2 bg-amber-500 text-white text-sm rounded-md hover:bg-amber-600 transition-colors font-medium"
                        >
                          Contact me
                        </button>
                        <button
                          onClick={() => {
                            setErrorMessage(null);
                            window.location.href = '/';
                          }}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Use Presets
                        </button>
                      </div>
                      
                      <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-3">
                        Thank you for your patience! 🙏
                      </p>
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
