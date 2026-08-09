'use client';

import { ChatRequestOptions, isToolOrDynamicToolUIPart } from 'ai';
import { UIMessage } from '@ai-sdk/react';
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

  // Extract text content from parts
  const textContent = message.parts
    ?.filter((part) => part.type === 'text')
    .map((part) => part.type === 'text' ? part.text : '')
    .join(' ') || '';
  
  // Check if we have meaningful text content (more than just confirmations)
  const hasTextContent = textContent.trim().length > 0;
  const hasTools = toolInvocations.length > 0;
  
  // Show text content if we have meaningful content, even with tools present
  const showTextContent = hasTextContent;

  return (
    <div className="flex h-full w-full flex-col px-4">
      {/* Single scrollable container for both tool and text content */}
      <div className="custom-scrollbar flex h-full w-full flex-col overflow-y-auto">
        {/* Tool invocation result - displayed at the top */}
        {hasTools && (
          <div className="mb-4 w-full">
            <ToolRenderer
              toolInvocations={toolInvocations}
              messageId={message.id || 'current-msg'}
            />
          </div>
        )}

        {/* Text content - only show if meaningful and not redundant with tools */}
        {showTextContent && (
          <div className="w-full text-(--hero-text)">
            <ChatMessageContent
              message={message}
              isLast={true}
              isLoading={isLoading}
              reload={reload}
              addToolResult={addToolResult}
              skipToolRendering={true}
            />
          </div>
        )}

        {/* Add some padding at the bottom for better scrolling experience */}
        <div className="pb-4"></div>
      </div>
    </div>
  );
}
