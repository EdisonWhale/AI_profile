"use client"

import { CSSProperties, useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Sparkles, ArrowRight, Code, Brain, Rocket } from "lucide-react"

interface ChatLandingProps {
  submitQuery: (message: string) => void
}

const suggestedQuestions = [
  {
    icon: <Code className="w-5 h-5" />,
    title: "Technical deep dive",
    description: "What's the architecture behind your AI projects?",
    query: "Can you explain the architecture and tech stack of your most complex AI project?",
    accent: "#60a5fa",
    accentSoft: "#22d3ee",
    iconColor: "text-blue-400",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "AI & ML Experience",
    description: "Tell me about your LLM implementation experience",
    query: "What is your experience with fine-tuning LLMs and developing RAG applications?",
    accent: "#a78bfa",
    accentSoft: "#f472b6",
    iconColor: "text-purple-400",
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "Project execution",
    description: "How do you handle feature delivery from end to end?",
    query: "Can you walk me through how you take a feature from concept to production?",
    accent: "#34d399",
    accentSoft: "#2dd4bf",
    iconColor: "text-emerald-400",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Quick summary",
    description: "What are your core strengths and background?",
    query: "Give me a quick 30-second summary of your background, core technical skills, and what you're looking for.",
    accent: "#fbbf24",
    accentSoft: "#fb923c",
    iconColor: "text-amber-400",
  },
]

const ChatLanding: React.FC<ChatLandingProps> = ({ submitQuery }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 flex flex-col items-center"
      >
        <div className="section-eyebrow mb-6">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <span>AI-Powered Interactive Resume</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
          Chat with my <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">Digital Twin</span>
        </h1>
        <p className="section-body mx-auto max-w-2xl text-lg">
          Ask anything about my experience, technical skills, projects, or background. I'm an AI assistant trained on EdisonWhale's professional profile.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {suggestedQuestions.map((item, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => submitQuery(item.query)}
            className="surface-card chat-suggestion-card group relative flex w-full items-start gap-4 overflow-hidden p-6 text-left"
            style={
              {
                "--chat-suggestion-accent": item.accent,
                "--chat-suggestion-accent-soft": item.accentSoft,
              } as CSSProperties
            }
          >
            {/* Background gradient effect on hover */}
            <div
              className="chat-suggestion-overlay pointer-events-none absolute inset-px rounded-[calc(1.75rem-1px)]"
            />
            
            <div className={`surface-panel relative z-10 rounded-xl p-3 shadow-inner ${item.iconColor} shrink-0`}>
                {item.icon}
            </div>
            
            <div className="relative z-10 flex-1">
              <h3 className="section-heading mb-1 text-lg transition-colors group-hover:text-primary">
                {item.title}
              </h3>
              <p className="section-body text-sm transition-colors group-hover:text-foreground/80">
                {item.description}
              </p>
            </div>
            
            <div className={`relative z-10 mt-2 transform transition-all duration-300 ${
              hoveredIndex === index ? "translate-x-0 opacity-100 text-primary" : "-translate-x-4 text-(--hero-muted) opacity-0"
            }`}>
              <ArrowRight className="w-5 h-5" />
            </div>
          </motion.button>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="section-body flex items-center justify-center gap-2 text-sm">
          <MessageSquare className="w-4 h-4" />
          Or just type your own question in the input box below
        </p>
      </motion.div>
    </div>
  )
}

export default ChatLanding;
