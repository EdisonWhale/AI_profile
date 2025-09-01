// src/components/chat/tool-renderer.tsx
import { ToolUIPart, DynamicToolUIPart, getToolOrDynamicToolName } from 'ai';
import { Contact } from '../contact';
import AvailabilityCard from '../AvailabilityCard';
import { Presentation } from '../presentation';
import AllProjects from '../projects/AllProjects';
import Resume from '../resume';
import Skills from '../skills';
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';
import ChatMessageContent from './chat-message-content';

// Type for the entry-level data
interface AvailabilityData {
  availability: string;
  preferences: {
    roleTypes: string[];
    industries: string[];
    workMode: string;
    location: string;
  };
  experience: {
    entryLevelCompleted: string;
    freelanceWork: string;
    projectExperience: string;
  };
  skills: {
    technical: string[];
    soft: string[];
  };
  achievements: string[];
  lookingFor: {
    growthOpportunities: string;
    mentorship: string;
    impactfulWork: string;
    technicalChallenges: string;
    collaboration: string;
  };
  contact: {
    email: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
}

interface ToolRendererProps {
  toolInvocations: (ToolUIPart | DynamicToolUIPart)[];
  messageId: string;
}

export default function ToolRenderer({
  toolInvocations,
  messageId,
}: ToolRendererProps) {
  return (
    <div className="w-full transition-all duration-300">
      {toolInvocations.map((tool) => {
        const toolCallId = tool.toolCallId;
        const toolName = getToolOrDynamicToolName(tool);

        // Return specialized components based on tool name
        switch (toolName) {
          case 'getProjects':
            const projectsMessage = tool.state === 'output-available' && tool.output 
              ? (tool.output as any).summary 
              : null;
            
            return (
              <div key={toolCallId} className="w-full space-y-4">
                <div className="w-full overflow-hidden rounded-lg">
                  <AllProjects />
                </div>
                {projectsMessage && (
                  <ChatBubble variant="received">
                    <ChatBubbleMessage>
                      <div className="w-full">
                        <p className="break-words whitespace-pre-wrap">{projectsMessage}</p>
                      </div>
                    </ChatBubbleMessage>
                  </ChatBubble>
                )}
              </div>
            );

          case 'getPresentation':
            const presentationMessage = tool.state === 'output-available' && tool.output 
              ? (tool.output as any).professionalSummary 
              : null;
            
            return (
              <div key={toolCallId} className="w-full space-y-4">
                <div className="w-full overflow-hidden rounded-lg">
                  <Presentation />
                </div>
                {presentationMessage && (
                  <ChatBubble variant="received">
                    <ChatBubbleMessage>
                      <div className="w-full">
                        <p className="break-words whitespace-pre-wrap">{presentationMessage}</p>
                      </div>
                    </ChatBubbleMessage>
                  </ChatBubble>
                )}
              </div>
            );

          case 'getResume':
            const resumeMessage = tool.state === 'output-available' && tool.output 
              ? (tool.output as any).message 
              : null;
            
            return (
              <div key={toolCallId} className="w-full space-y-4">
                <div className="w-full rounded-lg">
                  <Resume />
                </div>
                {resumeMessage && (
                  <ChatBubble variant="received">
                    <ChatBubbleMessage>
                      <div className="w-full">
                        <p className="break-words whitespace-pre-wrap">{resumeMessage}</p>
                      </div>
                    </ChatBubbleMessage>
                  </ChatBubble>
                )}
              </div>
            );

          case 'getContact':
            const contactMessage = tool.state === 'output-available' && tool.output 
              ? (tool.output as any).message 
              : null;
            
            return (
              <div key={toolCallId} className="w-full space-y-4">
                <div className="w-full rounded-lg">
                  <Contact />
                </div>
                {contactMessage && (
                  <ChatBubble variant="received">
                    <ChatBubbleMessage>
                      <div className="w-full">
                        <p className="break-words whitespace-pre-wrap">{contactMessage}</p>
                      </div>
                    </ChatBubbleMessage>
                  </ChatBubble>
                )}
              </div>
            );

          case 'getSkills':
            const skillsMessage = tool.state === 'output-available' && tool.output 
              ? (tool.output as any).message 
              : null;
            
            return (
              <div key={toolCallId} className="w-full space-y-4">
                <div className="w-full rounded-lg">
                  <Skills />
                </div>
                {skillsMessage && (
                  <ChatBubble variant="received">
                    <ChatBubbleMessage>
                      <div className="w-full">
                        <p className="break-words whitespace-pre-wrap">{skillsMessage}</p>
                      </div>
                    </ChatBubbleMessage>
                  </ChatBubble>
                )}
              </div>
            );

          case 'getEntryLevel':
            const entryLevelMessage = tool.state === 'output-available' && tool.output 
              ? (tool.output as any).professionalMessage 
              : null;
            
            return (
              <div key={toolCallId} className="w-full space-y-4">
                <div className="w-full rounded-lg">
                  <AvailabilityCard data={tool.state === 'output-available' ? tool.output as AvailabilityData : undefined} />
                </div>
                {entryLevelMessage && (
                  <ChatBubble variant="received">
                    <ChatBubbleMessage>
                      <div className="w-full">
                        <p className="break-words whitespace-pre-wrap">{entryLevelMessage}</p>
                      </div>
                    </ChatBubbleMessage>
                  </ChatBubble>
                )}
              </div>
            );

          // Default renderer for other tools
          default:
            return (
              <div
                key={toolCallId}
                className="bg-secondary/10 w-full rounded-lg p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-medium">{toolName}</h3>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-100">
                    Tool Result
                  </span>
                </div>
                <div className="mt-2">
                  {tool.state === 'output-available' && typeof tool.output === 'object' ? (
                    <pre className="bg-secondary/20 overflow-x-auto rounded p-3 text-sm">
                      {JSON.stringify(tool.output, null, 2)}
                    </pre>
                  ) : tool.state === 'output-available' ? (
                    <p>{String(tool.output)}</p>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}
