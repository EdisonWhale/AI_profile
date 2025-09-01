'use client';

import { motion } from 'framer-motion';
import { Award, Code, GraduationCap, Mail, MessageSquare, Briefcase } from 'lucide-react';
import React from 'react';

import { presetReplies } from '@/lib/config-loader';

interface ChatLandingProps {
  submitQuery: (query: string) => void;
  handlePresetReply?: (question: string, reply: string, tool: string) => void;
}

const ChatLanding: React.FC<ChatLandingProps> = ({ submitQuery, handlePresetReply }) => {

  // Suggested questions that the user can click on
  const suggestedQuestions = [
    {
      icon: <MessageSquare className="h-4 w-4" />,
      text: 'Who are you?',
    },
    {
      icon: <Code className="h-4 w-4" />,
      text: 'What projects are you most proud of?',
    },
    {
      icon: <Award className="h-4 w-4" />,
      text: 'What are your skills?',
    },
    {
      icon: <Briefcase className="h-4 w-4" />,
      text: 'Am I available for opportunities?',
    },
    {
      icon: <Mail className="h-4 w-4" />,
      text: 'How can I reach you?',
    },
  ];

  const handleQuestionClick = (questionText: string) => {
    // Default to AI response for all questions
    submitQuery(questionText);
  };

  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      className="flex w-full flex-col items-center px-4 py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome message */}
      <motion.div className="mb-8 text-center" variants={itemVariants}>
        <h2 className="mb-3 text-2xl font-semibold">
            I'm Edison's digital twin, feel free to ask me anything!
        </h2>
        <p className="text-muted-foreground mx-auto max-w-md">
          Begin your interview with my digital twin.
        </p>
      </motion.div>

      {/* Available for Opportunities Button */}
      <motion.div className="mb-8" variants={itemVariants}>
        <motion.button
          onClick={() => handleQuestionClick('Am I available for opportunities?')}
          className="apple-glass apple-glow-hover rounded-full px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 ease-out hover:scale-[1.02] flex items-center gap-2 mx-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{background: 'var(--apple-system-green)'}}></span>
            <span className="relative inline-flex h-2 w-2 rounded-full apple-status-dot"></span>
          </span>
          Available for Opportunities
        </motion.button>
      </motion.div>

      {/* Suggested questions */}
      <motion.div
        className="w-full max-w-md space-y-3"
        variants={containerVariants}
      >
        {suggestedQuestions.map((question, index) => (
          <motion.button
            key={index}
            className="apple-glass apple-glow-hover flex w-full items-center rounded-xl px-4 py-3 transition-all duration-300 ease-out"
            onClick={() => handleQuestionClick(question.text)}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="bg-background mr-3 rounded-full p-2">
              {question.icon}
            </span>
            <span className="text-left">{question.text}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ChatLanding;
