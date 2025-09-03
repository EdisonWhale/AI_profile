'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Code2, Globe, Briefcase, GraduationCap, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

interface AvailabilityCardProps {
  data?: AvailabilityData;
}

const AvailabilityCard = ({ data }: AvailabilityCardProps) => {
  const router = useRouter();

  const handleContactClick = () => {
    // Navigate to chat page with contact preset question
    router.push('/chat?q=How%20can%20I%20reach%20you?');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="apple-glass apple-tech-bg mx-auto mt-8 w-full max-w-4xl rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12 apple-glow-hover"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar placeholder */}
          <div className="apple-avatar-glow h-16 w-16 overflow-hidden rounded-full shadow-md">
            <img
              src="/profile.jpeg"
              alt="Edison's avatar"
              className="h-full w-full object-cover object-[center_top_-5%] scale-95"
            />
          </div>
          <div>
            <h2 className="text-foreground text-2xl font-semibold">
              Edison Xu
            </h2>
            <p className="text-muted-foreground text-sm">
              Software Engineer & AI/ML Engineer
            </p>
          </div>
        </div>

        {/* Enhanced Live badge with availability status */}
        <div className="mt-4 flex flex-col items-center gap-2 sm:mt-0 sm:items-end">
          <span className="flex items-center gap-1 rounded-full border border-green-500 px-3 py-0.5 text-sm font-medium text-green-500">
            <span className="apple-status-dot relative flex h-2 w-2 rounded-full"></span>
            Open to Opportunities
          </span>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            Open to full-time software engineer for full stack development and AI/ML engineer roles
          </p>
        </div>
      </div>

      {/* Current Role Highlight Section */}
      <div className="mb-8 rounded-2xl apple-glass p-6 border border-[rgba(59,130,246,0.2)] apple-glow">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-400 flex items-center justify-center shadow-lg">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Current Role</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Position</p>
            <p className="text-sm text-sky-600 dark:text-sky-400 font-semibold">
              Software Engineer (Generative AI team)
            </p>
            <p className="text-xs text-muted-foreground">Highmark Health • Pittsburgh, PA</p>
          </div>
                      <div>
              <p className="text-sm font-medium text-foreground mb-1">Focus Areas</p>
              <p className="text-sm text-sky-600 dark:text-sky-400 font-semibold">
                AI/ML Engineering • Full-Stack web Development • multi-agents architecture
              </p>
            </div>
        </div>
      </div>

      {/* Key Information Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <GraduationCap className="mt-1 h-5 w-5 text-sky-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Education</p>
            <p className="text-muted-foreground text-sm">
              MS Computational Science & Engineering
            </p>
            <p className="text-xs text-muted-foreground">Georgia Institute of Technology</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-1 h-5 w-5 text-sky-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Location</p>
            <p className="text-muted-foreground text-sm">
              Atlanta, GA • Open to remote and relocation
            </p>
            <div className="flex gap-2 mt-1">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Remote Available</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Open to Relocation</span>
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex items-start gap-3 sm:col-span-2">
          <Code2 className="mt-1 h-5 w-5 text-sky-500" />
          <div className="w-full">
            <p className="text-foreground text-sm font-medium">Core Technologies</p>
            <div className="text-muted-foreground grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-2">
              <ul className="decoration-none list-disc pl-4">
                <li>Python, TypeScript, Java, Go, JavaScript</li>
                <li>React.js, Vue.js, Spring Boot, FastAPI</li>
                <li>Vertex AI, Gemini API, LangGraph, RAG Systems</li>
                <li>Docker, Kubernetes, AWS, GCP, Azure</li>
              </ul>
              <ul className="list-disc pl-4">
                <li>Machine Learning, AI Agents, Multi-Agent Systems</li>
                <li>MySQL, PostgreSQL, MongoDB, Redis</li>
                <li>PySpark, Azure Databricks, Big Data Processing</li>
                <li>
                  <button
                    onClick={() => window.location.href = '/chat?q=What%20are%20your%20skills%3F%20Give%20me%20a%20list%20of%20your%20soft%20and%20hard%20skills.'}
                    className="cursor-pointer items-center text-sky-500 underline bg-transparent border-none p-0 hover:text-sky-600 transition-colors duration-200"
                  >
                    See more skills
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* What I bring */}
      <div className="mt-10">
        <p className="text-foreground mb-2 text-lg font-semibold">
          What I bring
        </p>
        <div className="text-foreground text-sm space-y-2">
          <p>✅ <strong>Enterprise AI Experience:</strong> Currently building autonomous AI research agents and multi-modal chatbots at Highmark Health</p>
          <p>✅ <strong>Microsoft AI Hackathon Participant:</strong> Built FigBrain - a Figma multi-agent plugin using Model Context Protocol with 85% first-try accuracy</p>
          <p>✅ <strong>Full-Stack Expertise:</strong> Developed high-efficiency search engines, distributed file storage systems, and mobile apps</p>
          <p>✅ <strong>Advanced ML/AI Skills:</strong> Expertise in LangGraph, RAG systems, embedding models, and multi-agent architectures</p>
        </div>
      </div>

      {/* Goal */}
      <div className="mt-8">
        <p className="text-foreground mb-2 text-lg font-semibold">What I'm Looking For</p>
        <p className="text-foreground text-sm">
          I'm passionate about building AI-powered solutions that make a real impact. I'm looking for opportunities to work on cutting-edge AI/ML technologies, contribute to innovative projects, and grow my expertise in enterprise-level development. I love tackling complex problems with simple solutions and collaborating with experienced teams to create meaningful technology! 🚀
        </p>
      </div>

      {/* Contact button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={handleContactClick}
          className="cursor-pointer rounded-full bg-gradient-to-r from-sky-400 to-blue-400 px-6 py-3 font-semibold text-white transition-all duration-300 hover:from-sky-500 hover:to-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 apple-button-press"
        >
          Contact me
        </button>
      </div>
    </motion.div>
  );
};

export default AvailabilityCard;
