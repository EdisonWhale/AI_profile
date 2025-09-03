import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getPresentation = tool({
  description:
    'This tool provides a comprehensive professional introduction and personal background, suitable for interviews and formal presentations.',
  inputSchema: z.object({}),
  execute: async () => {
    const config = getConfig();
    
    return {
      presentation: config.personal.bio,
      name: config.personal.name,
      title: config.personal.title,
      location: config.personal.location,
      education: config.education.current,
      traits: config.personality?.traits || [],
      interests: config.personality?.interests || [],
      motivation: config.personality?.motivation || "Driven by a passion for building intelligent, accessible technology that bridges the gap between human needs and digital solutions. I believe in creating systems that don't just work, but truly enhance people's lives through thoughtful AI integration and user-centered design."
    };
  },
});
