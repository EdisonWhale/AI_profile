import { z } from 'zod';

export const portfolioConfigSchema = z
  .object({
    personal: z
      .object({
        name: z.string(),
        workAuthorization: z
          .object({
            status: z.string(),
            requiresSponsorship: z.boolean(),
            notes: z.string().optional(),
          })
          .optional(),
        location: z
          .object({
            current: z.string(),
            remote: z.boolean(),
            relocation: z.boolean(),
            preferredLocations: z.array(z.string()),
            timezone: z.string(),
          })
          .passthrough(),
        title: z.string(),
        email: z.string(),
        phone: z.string().optional(),
        handle: z.string(),
        bio: z.string(),
        avatar: z.string(),
        fallbackAvatar: z.string(),
      })
      .passthrough(),
    education: z
      .object({
        current: z
          .object({
            degree: z.string(),
            institution: z.string(),
            duration: z.string(),
            graduationDate: z.string(),
          })
          .passthrough(),
        achievements: z.array(z.string()),
      })
      .passthrough(),
    experience: z.array(
      z
        .object({
          company: z.string(),
          position: z.string(),
          type: z.string(),
          duration: z.string(),
          description: z.string(),
          technologies: z.array(z.string()),
        })
        .passthrough()
    ),
    skills: z
      .object({
        programming: z.array(z.string()),
        ml_ai: z.array(z.string()),
        web_development: z.array(z.string()),
        databases: z.array(z.string()),
        devops_cloud: z.array(z.string()),
        big_data: z.array(z.string()),
        soft_skills: z.array(z.string()),
      })
      .passthrough(),
    projects: z.array(
      z
        .object({
          title: z.string(),
          category: z.string(),
          description: z.string(),
          techStack: z.array(z.string()),
          date: z.string(),
          status: z.string(),
          featured: z.boolean(),
          achievements: z.array(z.string()).optional(),
          metrics: z.array(z.string()).optional(),
          links: z
            .array(
              z
                .object({
                  name: z.string(),
                  url: z.string(),
                })
                .passthrough()
            )
            .optional(),
          images: z
            .array(
              z
                .object({
                  src: z.string(),
                  alt: z.string(),
                })
                .passthrough()
            )
            .optional(),
        })
        .passthrough()
    ),
    social: z
      .object({
        linkedin: z.string(),
        github: z.string(),
      })
      .passthrough(),
    entryLevel: z
      .object({
        seeking: z.boolean(),
        currentStatus: z.string(),
        focusAreas: z.array(z.string()),
        availability: z.string(),
        workStyle: z.string(),
        goals: z.string(),
      })
      .passthrough(),
    personality: z
      .object({
        traits: z.array(z.string()),
        interests: z.array(z.string()),
        funFacts: z.array(z.string()),
        workingStyle: z.string(),
        motivation: z.string(),
      })
      .passthrough(),
    resume: z
      .object({
        title: z.string(),
        description: z.string(),
        fileType: z.string(),
        lastUpdated: z.string(),
        fileSize: z.string(),
        downloadUrl: z.string(),
      })
      .passthrough(),
    chatbot: z
      .object({
        name: z.string(),
        personality: z.string(),
        tone: z.string(),
        language: z.string(),
        responseStyle: z.string(),
        useEmojis: z.boolean(),
        topics: z.array(z.string()),
      })
      .passthrough(),
    presetQuestions: z
      .object({
        me: z.array(z.string()),
        professional: z.array(z.string()),
        projects: z.array(z.string()),
        contact: z.array(z.string()),
        fun: z.array(z.string()),
      })
      .passthrough(),
    meta: z
      .object({
        configVersion: z.string(),
        lastUpdated: z.string(),
        generatedBy: z.string(),
        description: z.string(),
      })
      .passthrough(),
  })
  .passthrough();
