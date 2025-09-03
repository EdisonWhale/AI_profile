export interface PersonalInfo {
  name: string;
  location: {
    current: string;
    remote: boolean;
    relocation: boolean;
    preferredLocations: string[];
    timezone: string;
  };
  title: string;
  email: string;
  phone?: string;
  handle: string;
  bio: string;
  avatar: string;
  fallbackAvatar: string;
}

export interface Education {
  current: {
    degree: string;
    institution: string;
    duration: string;
    graduationDate: string;
  };
  achievements: string[];
}

export interface Experience {
  company: string;
  position: string;
  type: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface Skills {
  programming: string[];
  ml_ai: string[];
  web_development: string[];
  databases: string[];
  devops_cloud: string[];
  big_data: string[];
  soft_skills: string[];
}

export interface ProjectLink {
  name: string;
  url: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  techStack: string[];
  date: string;
  status: string;
  featured: boolean;
  achievements?: string[];
  metrics?: string[];
  links?: ProjectLink[];
  images?: ProjectImage[];
}

export interface Social {
  linkedin: string;
  github: string;
}

export interface EntryLevel {
  seeking: boolean;
  currentStatus: string;
  focusAreas: string[];
  availability: string;
  workStyle: string;
  goals: string;
}

export interface Personality {
  traits: string[];
  interests: string[];
  funFacts: string[];
  workingStyle: string;
  motivation: string;
}

export interface Resume {
  title: string;
  description: string;
  fileType: string;
  lastUpdated: string;
  fileSize: string;
  downloadUrl: string;
}

export interface Chatbot {
  name: string;
  personality: string;
  tone: string;
  language: string;
  responseStyle: string;
  useEmojis: boolean;
  topics: string[];
}

export interface PresetQuestions {
  me: string[];
  professional: string[];
  projects: string[];
  contact: string[];
  fun: string[];
}

export interface Meta {
  configVersion: string;
  lastUpdated: string;
  generatedBy: string;
  description: string;
}

export interface PortfolioConfig {
  personal: PersonalInfo;
  education: Education;
  experience: Experience[];
  skills: Skills;
  projects: Project[];
  social: Social;
  entryLevel: EntryLevel;
  personality: Personality;
  resume: Resume;
  chatbot: Chatbot;
  presetQuestions: PresetQuestions;
  meta: Meta;
}

// Utility types for component props
export interface ProjectContentProps {
  project: {
    title: string;
  };
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  handle: string;
  socials: Array<{
    name: string;
    url: string;
  }>;
}

export interface ProfileInfo {
  name: string;
  location: {
    current: string;
    remote: boolean;
    relocation: boolean;
    preferredLocations: string[];
    timezone: string;
  };
  description: string;
  src: string;
  fallbackSrc: string;
}

export interface SkillCategory {
  category: string;
  icon: React.ReactNode;
  skills: string[];
  color: string;
}
