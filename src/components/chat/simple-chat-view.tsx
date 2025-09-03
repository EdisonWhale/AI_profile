'use client';

import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import { ChatRequestOptions, isToolOrDynamicToolUIPart } from 'ai';
import { UIMessage } from '@ai-sdk/react';
import { motion } from 'framer-motion';
import ChatMessageContent from './chat-message-content';
import ToolRenderer from './tool-renderer';

interface SimplifiedChatViewProps {
  message: UIMessage;
  isLoading: boolean;
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<void>;
  addToolResult?: <TOOL extends string>({ tool, toolCallId, output, }: { tool: TOOL; toolCallId: string; output: unknown; }) => Promise<void>;
}

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
};

export function SimplifiedChatView({
  message,
  isLoading,
  reload,
  addToolResult,
}: SimplifiedChatViewProps) {
  if (message.role !== 'assistant') return null;

  // Extract tool invocations that are in "output-available" state
  const toolInvocations =
    message.parts
      ?.filter(
        (part) =>
          isToolOrDynamicToolUIPart(part) &&
          part.state === 'output-available'
      ) || [];

  // Only display the first tool (if any)
  const currentTool = toolInvocations.length > 0 ? [toolInvocations[0]] : [];

  // Extract text content from parts
  const textContent = message.parts
    ?.filter((part) => part.type === 'text')
    .map((part) => part.type === 'text' ? part.text : '')
    .join(' ') || '';
  
  // Check if we have meaningful text content (more than just confirmations)
  const hasTextContent = textContent.trim().length > 0;
  const hasTools = currentTool.length > 0;
  
  // Show text content if we have meaningful content, even with tools present
  const showTextContent = hasTextContent;

  console.log('currentTool', currentTool);

  return (
    <motion.div {...MOTION_CONFIG} className="flex h-full w-full flex-col px-4">
      {/* Single scrollable container for both tool and text content */}
      <div className="custom-scrollbar flex h-full w-full flex-col overflow-y-auto">
        {/* Tool invocation result - displayed at the top */}
        {hasTools && (
          <div className="mb-4 w-full">
            <ToolRenderer
              toolInvocations={currentTool}
              messageId={message.id || 'current-msg'}
            />
          </div>
        )}

        {/* Text content - only show if meaningful and not redundant with tools */}
        {showTextContent && (
          <div className="w-full">
            <ChatBubble variant="received" className="w-full">
              <ChatBubbleMessage className="w-full">
                <ChatMessageContent
                  message={message}
                  isLast={true}
                  isLoading={isLoading}
                  reload={reload}
                  addToolResult={addToolResult}
                  skipToolRendering={true}
                />
              </ChatBubbleMessage>
            </ChatBubble>
          </div>
        )}

        {/* Add some padding at the bottom for better scrolling experience */}
        <div className="pb-4"></div>
      </div>
    </motion.div>
  );
}
