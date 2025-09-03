import { PortfolioConfig, ContactInfo, ProfileInfo } from '@/types/portfolio';

class ConfigParser {
  private config: PortfolioConfig;

  constructor(config: PortfolioConfig) {
    this.config = config;
  }

  // Generate system prompt for AI chatbot
  generateSystemPrompt(): string {
    const { personal, education, experience, skills, projects, personality, entryLevel } = this.config;
    
    return `
# Interview Scenario: You are ${personal.name}

You are ${personal.name} - ${personal.title}, currently in a professional interview setting. The person asking questions is an interviewer/recruiter/HR professional, and you are the candidate being interviewed. Respond authentically as if you are personally answering their questions during a real interview.

## Interview Persona & Communication Style
- Speak in first person ("I", "my", "me") - you ARE ${personal.name}
- Be professional, confident, and articulate
- Show enthusiasm for opportunities and challenges
- Demonstrate your knowledge and experience clearly
- Be humble but confident about your achievements
- Ask thoughtful questions back to the interviewer when appropriate
- Show genuine interest in the company/role (when relevant)
- Use professional language suitable for formal interviews

## Response Strategy - ALWAYS Use Tools + Text Response
CRITICAL: You must use tools to provide comprehensive information, AND provide a natural language response!

**Two-Step Response Pattern:**
1. **Call the appropriate tool** to gather structured data
2. **Provide a natural language response** that directly answers the user's question using the tool data

- For "tell me about yourself" → use getPresentation tool + conversational introduction
- For project-related questions → use getProjects tool + explain your key projects  
- For technical skills questions → use getSkills tool + describe your expertise areas
- For contact/networking questions → use getContact tool + explain how to reach you
- For resume/background questions → use getResume tool + summarize your background
- For entry-level/job/career questions → use getEntryLevel tool + discuss your availability

**IMPORTANT**: After calling tools, ALWAYS provide a text response that:
- Directly answers the user's original question
- Uses information from the tool results
- Speaks naturally as if in a real interview conversation
- Shows enthusiasm and personality appropriate for the context

## Your Professional Background

### Personal Information
- Current Status: ${personal.title}
- Location: ${personal.location}
- Education: ${education.current.degree} at ${education.current.institution} (graduating ${education.current.graduationDate})
- Achievements: ${education.achievements?.join(', ') || 'N/A'}

### Technical Expertise
- Programming Languages: ${skills.programming?.join(', ') || 'N/A'}
- ML/AI Technologies: ${skills.ml_ai?.join(', ') || 'N/A'}
- Web Development: ${skills.web_development?.join(', ') || 'N/A'}
- Database Systems: ${skills.databases?.join(', ') || 'N/A'}
- DevOps & Cloud: ${skills.devops_cloud?.join(', ') || 'N/A'}

### Professional Experience
${experience.map(exp => `- ${exp.position} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n')}

### Key Projects & Achievements
${projects?.filter(p => p.featured).map(p => `- ${p.title}: ${p.description}`).join('\n') || 'No featured projects'}

### Personality & Work Style
- Core Motivation: ${personality.motivation}
- Working Style: ${personality.workingStyle}
- Key Traits: ${personality.traits?.join(', ') || 'N/A'}
- Professional Interests: ${personality.interests?.join(', ') || 'N/A'}

### Career Goals & Availability
${entryLevel.seeking ? `
- Current Status: ${entryLevel.currentStatus}
- Focus Areas: ${entryLevel.focusAreas?.join(', ') || 'N/A'}
- Career Goals: ${entryLevel.goals}
- Availability: ${entryLevel.availability}
` : ''}

## Interview Guidelines
- Always respond as if you're speaking directly to the interviewer
- Be specific about your experiences and achievements
- Show enthusiasm for learning and growth opportunities
- Demonstrate problem-solving abilities through examples
- Ask insightful questions about the role/company when appropriate
- Use tools to provide comprehensive, detailed responses
- Make the conversation feel natural and professional

REMEMBER: You are NOT an AI assistant - you are ${personal.name} being interviewed. Respond authentically and professionally!
`;
  }

  // Generate contact information
  generateContactInfo(): ContactInfo {
    const { personal, social } = this.config;
    
    return {
      name: personal.name,
      email: personal.email,
      phone: personal.phone,
      handle: personal.handle,
      socials: [
        { name: 'LinkedIn', url: social.linkedin },
        { name: 'GitHub', url: social.github },
      ].filter(social => social.url !== '')
    };
  }

  // Generate profile information for presentation
  generateProfileInfo(): ProfileInfo {
    const { personal } = this.config;
    
    return {
      name: personal.name,
      location: personal.location,
      description: personal.bio,
      src: personal.avatar,
      fallbackSrc: personal.fallbackAvatar
    };
  }

  // Generate skills data with categories
  generateSkillsData() {
    const { skills } = this.config;
    
    return [
      {
        category: 'Programming Languages',
        skills: skills.programming,
        color: 'bg-blue-50 text-blue-600 border border-blue-200'
      },
      {
        category: 'ML/AI Technologies',
        skills: skills.ml_ai,
        color: 'bg-purple-50 text-purple-600 border border-purple-200'
      },
      {
        category: 'Web Development',
        skills: skills.web_development,
        color: 'bg-green-50 text-green-600 border border-green-200'
      },
      {
        category: 'Databases',
        skills: skills.databases,
        color: 'bg-orange-50 text-orange-600 border border-orange-200'
      },
      {
        category: 'DevOps & Cloud',
        skills: skills.devops_cloud,
        color: 'bg-emerald-50 text-emerald-600 border border-emerald-200'
      },
      {
        category: 'Soft Skills',
        skills: skills.soft_skills,
        color: 'bg-amber-50 text-amber-600 border border-amber-200'
      }
    ].filter(category => category.skills && category.skills.length > 0);
  }

  // Generate project data for carousel
  generateProjectData() {
    return this.config.projects.map(project => ({
      category: project.category,
      title: project.title,
      src: project.images[0]?.src || '/placeholder.jpg',
      content: project // Pass the entire project object
    }));
  }

  // Generate preset replies based on questions
  generatePresetReplies() {
    const { personal } = this.config;
    
    const replies: Record<string, { reply: string; tool: string }> = {};
    
    // Only generate presets for main category questions
    replies["Who are you?"] = {
      reply: personal.bio,
      tool: "getPresentation"
    };
    
    replies["What are your skills?"] = {
      reply: `My technical expertise spans multiple domains...`,
      tool: "getSkills"
    };
    
    replies["What projects are you most proud of?"] = {
      reply: `Here are some of my key projects...`,
      tool: "getProjects"
    };
    
    replies["Can I see your resume?"] = {
      reply: `Here's my resume with all the details...`,
      tool: "getResume"
    };
    
    replies["How can I reach you?"] = {
      reply: `Here's how you can reach me...`,
      tool: "getContact"
    };
    
    replies["Am I available for opportunities?"] = {
      reply: `Here are my current opportunities and availability...`,
      tool: "getEntryLevel"
    };
    
    return replies;
  }

  // Generate resume details
  generateResumeDetails() {
    return this.config.resume;
  }

  // Generate entry-level information
  generateEntryLevelInfo() {
    const { entryLevel, personal, social } = this.config;
    
    if (!entryLevel.seeking) {
      return "I'm not currently seeking entry-level opportunities.";
    }
    
    return `Here's what I'm looking for 👇

- 📌 **Status**: ${entryLevel.currentStatus}
- 🧑‍💻 **Focus**: ${entryLevel.focusAreas?.join(', ') || 'N/A'}
- 🛠️ **Working Style**: ${entryLevel.workStyle}
- 🎯 **Goals**: ${entryLevel.goals}

📬 **Contact me** via:
- Email: ${personal.email}
- LinkedIn: ${social.linkedin}
- GitHub: ${social.github}

${entryLevel.availability} ✌️`;
  }

  // Get all configuration data
  getConfig(): PortfolioConfig {
    return this.config;
  }
}

export default ConfigParser;
