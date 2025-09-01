import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getEntryLevel = tool({
  description: 'Provides comprehensive information about current professional experience, career preferences, and professional availability for recruiters and HR professionals.',
  inputSchema: z.object({}),
  execute: async () => {
    const config = getConfig();
    
    // Get current professional experience
    const currentExperience = config.experience.find(exp => exp.type === "Full-time");
    
    return {
      currentStatus: config.entryLevel.currentStatus,
      availability: config.entryLevel.availability,
      preferences: {
        roleTypes: config.entryLevel.focusAreas,
        industries: ["Technology", "AI/ML", "Healthcare Technology", "Web Development"],
        workMode: "Remote/Hybrid preferred",
        location: config.personal.location
      },
      experience: {
        currentPosition: currentExperience 
          ? `${currentExperience.position} at ${currentExperience.company} (${currentExperience.duration})`
          : "Currently employed in software engineering role",
        currentResponsibilities: currentExperience?.description || "Developing AI and ML solutions for enterprise applications",
        projectExperience: "Led multiple end-to-end projects including web full stack development, AI agent development, and ML models"
      },
      skills: {
        technical: [
          ...config.skills.programming,
          ...config.skills.ml_ai,
          ...config.skills.web_development,
          ...config.skills.databases,
          ...config.skills.devops_cloud
        ],
        soft: config.skills.soft_skills
      },
      achievements: config.education.achievements || [],
      lookingFor: {
        growthOpportunities: "Advanced technical challenges and leadership opportunities",
        mentorship: "Collaborating with senior developers and architects on complex projects",
        impactfulWork: config.personality.motivation,
        technicalChallenges: "Cutting-edge technologies and innovative solutions",
        collaboration: "Collaborative, innovative environments where I can contribute meaningfully"
      },
      contact: {
        email: config.personal.email,
        linkedin: config.social.linkedin,
        github: config.social.github,
        portfolio: "This AI-powered portfolio showcases my projects and skills"
      },
      personality: {
        traits: config.personality.traits,
        funFacts: config.personality.funFacts,
        workingStyle: config.personality.workingStyle
      },
      professionalMessage: "I'm currently working as a Software Engineer at Highmark Health, where I'm developing AI and ML solutions for enterprise applications. I'm always open to new opportunities that offer exciting technical challenges and the chance to work on impactful projects. My experience includes building autonomous AI agents, developing multi-modal chatbots, and architecting enterprise knowledge systems. I'm particularly interested in roles that combine my expertise in AI/ML with full-stack development, especially in environments that value innovation and cutting-edge technology. I'm adaptable, a fast learner, and passionate about creating technology that makes a real impact. What kind of projects or technical challenges is your team currently working on that I might be able to contribute to?"
    };
  },
});
