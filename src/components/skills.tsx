'use client';

import { motion } from 'framer-motion';
import { getConfig } from '@/lib/config-loader';
import { Brain, Code2, Cloud, type LucideIcon, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type CapabilityTone = 'ai' | 'fullstack' | 'backend' | 'soft';

interface CapabilityCardProps {
  title: string;
  description: string;
  signal: string;
  highlights: string[];
  supportingSkills: string[];
  icon: LucideIcon;
  tone: CapabilityTone;
  index: number;
}

function CapabilityCard({
  title,
  description,
  signal,
  highlights,
  supportingSkills,
  icon: Icon,
  tone,
  index,
}: CapabilityCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.07 }}
      className={cn('capability-card p-6 md:p-7', `capability-tone-${tone}`)}
    >
      <div className="relative z-1 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <p className="section-eyebrow">Capability</p>
              <span className="capability-signal text-xs font-medium">
                {signal}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="section-heading text-xl tracking-[-0.02em] md:text-2xl">
                {title}
              </h3>
              <p className="section-body max-w-xl text-sm leading-7 md:text-[0.96rem]">
                {description}
              </p>
            </div>
          </div>

          <div
            className="capability-icon shrink-0"
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="capability-section-label">Best at</p>
          <div className="flex flex-wrap gap-2.5">
            {highlights.map((skill) => (
              <span
                key={`${title}-${skill}`}
                className="capability-highlight-chip text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="section-divider space-y-3 border-t pt-5">
          <p className="capability-section-label">Commonly use</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {supportingSkills.map((skill) => (
              <li
                key={`${title}-support-${skill}`}
                className="capability-support-item"
              >
                <span className="capability-support-dot" aria-hidden="true" />
                <span className="text-(--panel-body-strong) text-sm leading-6">
                  {skill}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}

const Skills = () => {
  const config = getConfig();

  const groups = [
    {
      title: 'AI Product Systems',
      description:
        'LLM-powered products, retrieval workflows, and orchestration patterns designed for grounded outputs, reliable behavior, and production use.',
      signal: 'AI product systems',
      highlights: [
        'Retrieval / RAG',
        'Multi-agent workflows',
        'LLM application architecture',
        'Evaluation & iteration',
      ],
      supportingSkills: [
        'Vertex AI',
        'Gemini API',
        'LangGraph',
        'Embedding models',
        'Search / reranking',
      ],
      icon: Brain,
      tone: 'ai' as const,
    },
    {
      title: 'Full-Stack Product Engineering',
      description:
        'User-facing product development across frontend, backend, and the details that make systems feel clear, polished, and easy to use.',
      signal: 'Product execution',
      highlights: [
        'React / TypeScript',
        'Python / Go services',
        'System architecture',
        'API design & implementation',
      ],
      supportingSkills: [
        'Next.js',
        'Vue.js',
        'REST APIs',
        'State management',
        'Design systems',
      ],
      icon: Code2,
      tone: 'fullstack' as const,
    },
    {
      title: 'Backend, Cloud & Reliability',
      description:
        'APIs, infrastructure, deployment, and data foundations built to be observable, scalable, and production-ready.',
      signal: 'Platform reliability',
      highlights: ['Service architecture', 'API design', 'Deployment pipelines', 'Observability'],
      supportingSkills: [
        'Docker',
        'Kubernetes',
        'GCP / Cloud Run',
        'Redis',
        'SQL / PostgreSQL',
      ],
      icon: Cloud,
      tone: 'backend' as const,
    },
    {
      title: 'Engineering Approach',
      description:
        'I move quickly, communicate clearly, and care about building systems that are technically sound, useful to users, and maintainable over time.',
      signal: 'How I work',
      highlights: [
        'End-to-end ownership',
        'Product thinking',
        'Fast iteration',
        'Clear communication',
      ],
      supportingSkills: [
        'Cross-functional collaboration',
        'Structured problem solving',
        'Pragmatic decision-making',
        'Learning agility',
      ],
      icon: Users,
      tone: 'soft' as const,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {groups.map((group, index) => {
        return (
          <CapabilityCard
            key={group.title}
            index={index}
            title={group.title}
            description={group.description}
            signal={group.signal}
            highlights={group.highlights}
            supportingSkills={group.supportingSkills}
            icon={group.icon}
            tone={group.tone}
          />
        );
      })}
    </div>
  );
};

export default Skills;
