'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Code2, Globe, Briefcase } from 'lucide-react';
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
              Available for Opportunities
            </p>
          </div>
        </div>

        {/* Enhanced Live badge with availability status */}
        <div className="mt-4 flex flex-col items-center gap-2 sm:mt-0 sm:items-end">
          <span className="flex items-center gap-1 rounded-full border border-green-500 px-3 py-0.5 text-sm font-medium text-green-500">
            <span className="apple-status-dot relative flex h-2 w-2 rounded-full"></span>
            Available Now
          </span>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            Open to full-time entry-level software engineer for full stack web development and AI/ML engineer roles
          </p>
        </div>
      </div>

      {/* Availability Highlight Section */}
      <div className="mb-8 rounded-2xl apple-glass p-6 border border-[rgba(59,130,246,0.2)] apple-glow">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-400 flex items-center justify-center shadow-lg">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Current Availability Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Status</p>
            <p className="text-sm text-sky-600 dark:text-sky-400 font-semibold">
              {data?.availability || "✅ Available for immediate start"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Looking for</p>
            <p className="text-sm text-sky-600 dark:text-sky-400 font-semibold">
              Full-time software engineer and AI/ML engineer roles
            </p>
          </div>
        </div>
      </div>

      {/* Internship Info */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-1 h-5 w-5 text-sky-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Duration</p>
            <p className="text-muted-foreground text-sm">
              {data?.availability || "Available for full-time roles starting immediately"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Globe className="mt-1 h-5 w-5 text-sky-500" />
          <div>
            <p className="text-foreground text-sm font-medium">Location</p>
            <p className="text-muted-foreground text-sm">
              {data?.preferences.location || "Based in Atlanta, open to remote and relocation for the right opportunity"}
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
            <p className="text-foreground text-sm font-medium">Tech stack</p>
            <div className="text-muted-foreground grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-2">
              <ul className="decoration-none list-disc pl-4">
                {data?.skills.technical.slice(0, 4).map((skill, index) => (
                  <li key={index}>{skill}</li>
                )) || (
                  <>
                    <li>Python, SQL, JavaScript, HTML/CSS</li>
                    <li>FastAPI, Flask, Django, React.js</li>
                    <li>Scikit-learn, XGBoost, TensorFlow, OpenCV</li>
                    <li>OpenAI API, LangChain, LangGraph</li>
                  </>
                )}
              </ul>
              <ul className="list-disc pl-4">
                {data?.skills.technical.slice(4, 8).map((skill, index) => (
                  <li key={index}>{skill}</li>
                )) || (
                  <>
                    <li>Docker, Git, GitHub Actions, AWS</li>
                    <li>Firebase, Heroku, ESP32, IoT</li>
                    <li>Machine Learning, AI Agents</li>
                    <li>Web Scraping, Automation</li>
                  </>
                )}
                <li>
                  <button
                    onClick={() => window.location.href = '/chat?q=What%20are%20your%20skills%3F%20Give%20me%20a%20list%20of%20your%20soft%20and%20hard%20skills.'}
                    className="cursor-pointer items-center text-sky-500 underline bg-transparent border-none p-0 hover:text-sky-600 transition-colors duration-200"
                  >
                    See more
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
        <p className="text-foreground text-sm">
          {data?.experience.entryLevelCompleted || "Real-world ML experience from MookMati (Genre classification, FastAPI deployment, AWS)."} <br /> 
          {data?.achievements[0] || "2nd position in Smart India Hackathon 2025 among 88,221 teams with hideFlare cybersecurity tool."} <br /> 
          {data?.experience.freelanceWork || "25+ freelance automation projects delivered on Fiverr, cutting manual work by 60%."}
        </p>
      </div>

      {/* Goal */}
      <div className="mt-8">
        <p className="text-foreground mb-2 text-lg font-semibold">Goal</p>
        <p className="text-foreground text-sm">
          {data?.lookingFor.growthOpportunities || "Looking for roles that offer learning and advancement opportunities with experienced teams."} I want to work on {data?.lookingFor.technicalChallenges || "cutting-edge technologies"} that {data?.lookingFor.impactfulWork || "solve real-world problems and make a meaningful impact"}. I&apos;m passionate, adaptable, and ready to contribute to {data?.lookingFor.collaboration || "collaborative, innovative environments"}! 🚀
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
