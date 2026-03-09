'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, X, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';

// Import the same components that AI responses use
import { Presentation } from '@/components/presentation';
import AllProjects from '@/components/projects/AllProjects';
import Skills from '@/components/skills';
import { Contact } from '@/components/contact';
import Resume from '@/components/resume';
import AvailabilityCard from '@/components/AvailabilityCard';

interface PresetReplyProps {
  question: string;
  reply: string;
  tool: string;
  onGetAIResponse: (question: string, tool: string) => void;
  onClose?: () => void;
}

export function PresetReply({ question, reply, tool, onGetAIResponse, onClose }: PresetReplyProps) {
  const [showAIOption, setShowAIOption] = useState(true);

  const handleGetAIResponse = () => {
    setShowAIOption(false);
    onGetAIResponse(question, tool);
  };

  // Render the same components as AI responses for better consistency
  const renderPresetComponent = () => {
    switch (tool) {
      case 'getPresentation':
        return (
          <div className="w-full overflow-hidden rounded-lg mb-4">
            <Presentation />
          </div>
        );
      
      case 'getProjects':
        return (
          <div className="w-full overflow-hidden rounded-lg mb-4">
            <AllProjects />
          </div>
        );
      
      case 'getSkills':
        return (
          <div className="w-full rounded-lg mb-4">
            <Skills />
          </div>
        );
      
      case 'getContact':
        return (
          <div className="w-full rounded-lg mb-4">
            <Contact />
          </div>
        );
      
      case 'getResume':
        return (
          <div className="w-full rounded-lg mb-4">
            <Resume />
          </div>
        );
      
      case 'getEntryLevel':
        return (
          <div className="w-full rounded-lg mb-4">
            <AvailabilityCard />
          </div>
        );
      
      default:
        return null;
    }
  };

  const presetComponent = renderPresetComponent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto mb-4"
    >
      {/* If we have a component to render, show it like AI responses */}
      {presetComponent ? (
        <div className="w-full space-y-4">
          {/* Render the component */}
          {presetComponent}
          
          {/* Only show AI option when there's a major component - no text needed */}
          {showAIOption && (
            <ChatBubble variant="received">
              <ChatBubbleMessage className="surface-card w-full">
                <div className="w-full space-y-3 p-4">
                  {onClose && (
                    <div className="flex justify-end">
                      <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 rounded-full p-0 text-(--panel-body) hover:bg-surface-subtle hover:text-(--panel-body-strong)"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-3 px-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-brand-purple-light">
                          <Zap className="h-3 w-3 shrink-0" />
                          <span className="font-medium">Preset Response</span>
                        </div>
                        <span className="section-body text-xs">• Quick access response</span>
                      </div>
                      <Button 
                        onClick={handleGetAIResponse}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-linear-to-r from-brand-purple to-brand-blue text-white border-0 hover:from-brand-purple-light hover:to-brand-blue-light hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300 self-start sm:self-auto"
                      >
                        <Sparkles className="mr-1.5 h-3 w-3 shrink-0" />
                        Get AI Response
                      </Button>
                    </div>
                  </div>
                </div>
              </ChatBubbleMessage>
            </ChatBubble>
          )}
        </div>
      ) : (        // Fallback to text-based preset for tools without components
        <ChatBubble variant="received">
          <ChatBubbleMessage className="surface-card w-full">
            <div className="w-full space-y-4 p-4">
              {/* Close button */}
              {onClose && (
                <div className="flex justify-end">
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 rounded-full p-0 text-(--panel-body) hover:bg-surface-subtle hover:text-(--panel-body-strong)"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              {/* Reply content with enhanced formatting */}
              <div className="prose prose-sm max-w-none px-2 text-(--panel-body-strong)">
                {reply.split('\n').map((line, index) => {
                  if (line.trim() === '') return <br key={index} />;
                  
                  // Handle download link specially
                  if (line.includes('Download Resume Here') && line.includes('http')) {
                    const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
                    if (urlMatch) {
                      return (
                        <div key={index} className="surface-panel mb-4 rounded-xl p-4 shadow-sm backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-brand-blue/30 text-brand-blue rounded-full flex items-center justify-center border border-brand-blue/50">
                                <Download className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="section-heading block font-semibold">Resume Available</span>
                                <span className="section-body text-xs">Click to download PDF</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => window.open(urlMatch[1], '_blank')}
                              className="bg-brand-blue hover:bg-brand-blue-light text-white shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
                              size="sm"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      );
                    }
                  }
                  
                  // Handle regular links
                  if (line.includes('http')) {
                    const parts = line.split(/(https?:\/\/[^\s]+)/);
                    return (
                      <p key={index} className="mb-3 last:mb-0 leading-relaxed">
                        {parts.map((part, partIndex) => {
                          if (part.match(/^https?:\/\//)) {
                            return (
                              <a
                                key={partIndex}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-brand transition-colors underline decoration-2 underline-offset-2 hover:text-brand-purple"
                              >
                                {part}
                              </a>
                            );
                          }
                          return part;
                        })}
                      </p>
                    );
                  }
                  
                  // Handle bold markdown
                  if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <p key={index} className="mb-3 last:mb-0 leading-relaxed">
                        {parts.map((part, partIndex) => 
                          partIndex % 2 === 1 ? 
                            <strong key={partIndex} className="section-heading font-semibold">{part}</strong> : 
                            part
                        )}
                      </p>
                    );
                  }
                  
                  // Handle emoji lines (headers)
                  if (/^[🎯🚀💼🏆📊🔧🌟💡🎓📍🌍⚡🤝]/u.test(line)) {
                    return (
                      <p key={index} className="section-heading mb-2 text-base font-medium last:mb-0">
                        {line}
                      </p>
                    );
                  }
                  
                  // Handle bullet points
                  if (line.startsWith('• ') || line.startsWith('- ')) {
                    return (
                      <p key={index} className="section-body mb-1 ml-4 last:mb-0">
                        {line}
                      </p>
                    );
                  }
                  
                  return (
                    <p key={index} className="section-body mb-2 leading-relaxed last:mb-0">
                      {line}
                    </p>
                  );
                })}
              </div>
              
              {/* Enhanced AI option */}
              {showAIOption && (
                <div className="border-t border-[rgba(99,102,241,0.08)] pt-4 mt-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-brand-purple-light">
                          <Zap className="h-3 w-3 shrink-0" />
                          <span className="font-medium">Optimized Response</span>
                        </div>
                        <span className="section-body text-xs">• Quick access response</span>
                      </div>
                      <Button 
                        onClick={handleGetAIResponse}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-linear-to-r from-brand-purple to-brand-blue text-white border-0 hover:from-brand-purple-light hover:to-brand-blue-light hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300 self-start sm:self-auto"
                      >
                        <Sparkles className="mr-1.5 h-3 w-3 shrink-0" />
                        Get AI Response
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ChatBubbleMessage>
        </ChatBubble>
      )}
    </motion.div>
  );
}
