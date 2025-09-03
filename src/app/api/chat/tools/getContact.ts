import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getContact = tool({
  description:
    'This tool provides professional contact information and social media profiles.',
  inputSchema: z.object({}),
  execute: async () => {
    const config = getConfig();
    
    return {
      contact: {
        email: config.personal.email,
        location: config.personal.location,
        availability: config.entryLevel.availability
      },
      socialProfiles: {
        github: config.social.github,
        linkedin: config.social.linkedin,
      }
    };
  },
});
