
import { tool } from "ai";
import { z } from "zod";
import { getConfig } from "@/lib/config-loader";

export const getProjects = tool({
  description:
    "This tool showcases a comprehensive project portfolio, highlighting technical achievements and real-world impact.",
  inputSchema: z.object({}),
  execute: async () => {
    const config = getConfig();
    
    return {
      projects: config.projects.map(project => ({
        title: project.title,
        type: project.category,
        date: project.date,
        description: project.description,
        techStack: project.techStack,
        status: project.status,
        featured: project.featured,
        links: project.links || [],
        highlights: project.achievements || project.metrics || []
      }))
    };
  },
});