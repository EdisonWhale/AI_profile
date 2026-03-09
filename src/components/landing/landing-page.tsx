"use client";

import { useRouter } from "next/navigation";
import SearchInput from "./search-input";
import FloatingAiButton from "./floating-ai-button";
import { getConfig } from "@/lib/config-loader";
import { SectionShell } from "@/components/site/section-shell";
import { SiteNav } from "@/components/site/site-nav";
import Presentation from "@/components/presentation";
import Skills from "@/components/skills";
import Contact from "@/components/contact";
import AllProjects from "@/components/projects/AllProjects";
import { Sparkles, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface LandingPageProps {
  className?: string;
}

const LandingPage: React.FC<LandingPageProps> = () => {
  const router = useRouter();
  const config = getConfig();
  const previousEducation = (
    config.education as typeof config.education & {
      previous?: {
        degree: string;
        institution: string;
        duration: string;
        graduationDate?: string;
      };
    }
  ).previous;

  const handleSearchSubmit = (query: string) => {
    const encodedQuery = encodeURIComponent(query);
    router.push(`/chat?q=${encodedQuery}`);
  };

  const quickQuestions = [
    "Who are you?",
    "What projects are you most proud of?",
    "What are your skills?",
    "How can I reach you?",
  ];

  const proofItems = [
    "Georgia Tech MS CSE",
    "Highmark Health · Generative AI",
    "U.S. work authorized",
    "Open to remote / relocation",
  ];

  return (
    <div className="min-h-screen bg-(--hero-bg) text-foreground">
      <SiteNav />

      <main>
        {/* ═══════════════════════════════════════
            IMMERSIVE AI HERO — Dark gradient zone
            ═══════════════════════════════════════ */}
        <section className="hero-zone">
          {/* Animated mesh background */}
          <div className="hero-mesh" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />

          {/* Hero content — centered, AI-first */}
          <div className="hero-content flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-28 md:px-8 md:pb-28 md:pt-36">
            <motion.div
              className="mx-auto w-full max-w-3xl text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Eyebrow */}
              <p className="hero-eyebrow mb-6 text-[0.7rem] font-medium uppercase tracking-[0.28em]">
                Software Engineer | Generative AI | Full-Stack Systems
              </p>

              {/* Name */}
              <h1 className="hero-headline text-5xl font-bold tracking-[-0.04em] sm:text-6xl md:text-7xl">
                {config.personal.name.split(" ")[0]}{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--ai-gradient)" }}
                >
                  {config.personal.name.split(" ").slice(1).join(" ")}
                </span>
              </h1>

              {/* Headline */}
              <p className="hero-subtext mx-auto mt-5 max-w-3xl text-lg leading-8 md:text-xl">
                Building AI products, web applications, and AI agent systems
                end-to-end.
              </p>
            </motion.div>

            {/* AI Search Input — THE CENTERPIECE */}
            <motion.div
              className="mx-auto mt-10 w-full max-w-2xl md:mt-12"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            >
              <SearchInput
                onSubmit={handleSearchSubmit}
                placeholder="Ask AI about my projects, experience, skills..."
                variant="hero"
                className="w-full"
              />
            </motion.div>

            {/* Quick question pills */}
            <motion.div
              className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSearchSubmit(question)}
                  className="hero-pill px-4 py-2 text-sm"
                >
                  <Sparkles className="mr-1.5 inline-block h-3 w-3 opacity-50" />
                  {question}
                </button>
              ))}
            </motion.div>

            {/* Proof badges — subtle */}
            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              {proofItems.map((item) => (
                <span key={item} className="hero-badge">
                  {item}
                </span>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={() =>
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="scroll-indicator flex flex-col items-center gap-1 text-(--scroll-indicator) text-xs transition-colors hover:text-(--scroll-indicator-hover)"
              >
                scroll to explore
                <ChevronDown className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ───── About ───── */}
        <SectionShell
          id="about"
          eyebrow="About"
          title="I build production-grade AI products people actually use."
          description="A software engineer focused on generative AI, full-stack product development, and intelligent systems."
        >
          <Presentation embedded />
        </SectionShell>

        {/* ───── Experience ───── */}
        <SectionShell
          id="experience"
          eyebrow="Background"
          title="Experience and education"
          description="The work I’ve done, the systems I’ve owned, and the foundation behind how I build."
        >
          <div className="grid gap-12 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5">
              {config.experience.map((experience) => (
                <article
                  key={`${experience.company}-${experience.position}`}
                  className="timeline-card space-y-5 p-6 md:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="section-eyebrow timeline-company">
                        {experience.company}
                      </p>
                      <h3 className="section-heading text-xl md:text-2xl">
                        {experience.position}
                      </h3>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="timeline-detail-chip">
                          {experience.type}
                        </span>
                      </div>
                    </div>
                    <span className="timeline-badge text-sm font-medium">
                      {experience.duration}
                    </span>
                  </div>
                  <p className="section-body max-w-3xl text-base leading-7">
                    {experience.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.slice(0, 10).map((technology) => (
                      <span
                        key={`${experience.company}-${technology}`}
                        className="surface-chip px-3 py-1.5 text-xs font-medium"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="space-y-6">
              <div className="support-card support-card-education p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="section-eyebrow">Education</p>
                  <span className="support-chip">Academic foundation</span>
                </div>
                <div className="mt-5 space-y-5">
                  <div>
                    <h3 className="section-heading text-lg">
                      {config.education.current.degree}
                    </h3>
                    <p className="section-body mt-1 text-sm leading-6">
                      {config.education.current.institution} ·{" "}
                      {config.education.current.duration}
                    </p>
                    <p className="text-(--panel-body-strong) mt-2 text-sm leading-6">
                      Graduated {config.education.current.graduationDate}
                    </p>
                  </div>
                  {previousEducation ? (
                    <div className="section-divider border-t pt-5">
                      <h3 className="section-heading text-lg">
                        {previousEducation.degree}
                      </h3>
                      <p className="section-body mt-1 text-sm leading-6">
                        {previousEducation.institution} ·{" "}
                        {previousEducation.duration}
                      </p>
                      {previousEducation.graduationDate ? (
                        <p className="text-(--panel-body-strong) mt-2 text-sm leading-6">
                          Graduated {previousEducation.graduationDate}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="support-card support-card-signals p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="section-eyebrow">What I bring</p>
                  <span className="support-chip">Highlights</span>
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    "End-to-end ownership across product, backend, and applied AI workflows",
                    "Experience taking AI ideas from prototype to production-ready systems",
                    "Strong focus on retrieval, multi AI agent systems, and real-world usability",
                    "Product-minded engineering approach focused on reliability, clarity, and adoption",
                  ].map((item) => (
                    <div key={item} className="support-item">
                      <span className="support-item-dot" aria-hidden="true" />
                      <p className="section-body text-sm leading-6">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* ───── Projects ───── */}
        <SectionShell
          id="work"
          eyebrow="Projects"
          title="Selected work"
          description="A few representative projects across AI systems, distributed backend work, and product-facing engineering."
        >
          <AllProjects featuredOnly limit={3} showHeading={false} />
        </SectionShell>

        {/* ───── Skills ───── */}
        <SectionShell
          id="skills"
          eyebrow="Capabilities"
          title="Broad enough to ship, focused enough to specialize."
          description="I care less about listing every tool and more about showing the systems and outcomes I can reliably deliver."
        >
          <Skills />
        </SectionShell>

        {/* ───── Contact ───── */}
        <section id="contact" className="pb-24 pt-6 md:pb-32">
          <div className="content-width">
            <Contact />
          </div>
        </section>
      </main>

      <FloatingAiButton />
    </div>
  );
};

export default LandingPage;
