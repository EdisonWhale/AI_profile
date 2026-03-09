import { getConfig } from '@/lib/config-loader';
import { SiteNav } from '@/components/site/site-nav';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function ResumePage() {
  const config = getConfig();
  const resumePdfUrl = config.resume.pdfUrl || '/Edison-resume-2026.pdf';
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

  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-(--hero-bg) pt-20">
        <div className="content-width py-12 md:py-16">
          <div className="surface-card relative mx-auto max-w-4xl overflow-hidden rounded-4xl p-8 md:p-12">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-linear-to-br from-brand-blue/20 to-purple-600/20 blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-linear-to-tr from-brand-purple/20 to-brand-blue/20 blur-[100px]"></div>
            </div>
            
            <div className="relative">
              <header className="section-divider border-b pb-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="section-eyebrow">Resume</p>
                    <h1 className="section-heading mt-4 text-4xl tracking-[-0.03em] md:text-5xl">
                      {config.personal.name}
                    </h1>
                    <p className="section-body mt-3 text-lg">{config.personal.title}</p>
                    <div className="section-body mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <span>{config.personal.email}</span>
                      {config.personal.phone ? <span>{config.personal.phone}</span> : null}
                      <span>{config.personal.location.current}</span>
                      <a
                        href={config.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-blue hover:text-brand-purple transition-colors hover:underline"
                      >
                        LinkedIn
                      </a>
                      <a
                        href={config.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-blue hover:text-brand-purple transition-colors hover:underline"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>

                  <Button asChild className="solid-ai-btn apple-button-press rounded-xl md:self-start">
                    <a
                      href={resumePdfUrl}
                      download="Edison-resume-2026.pdf"
                    >
                      <Download className="h-4 w-4" />
                      Download Resume
                    </a>
                  </Button>
                </div>
              </header>

              <section className="mt-10">
                <h2 className="section-heading text-xl">Summary</h2>
                <p className="section-body mt-4 whitespace-pre-line text-base leading-8">
                  {config.personal.bio}
                </p>
              </section>

              <section className="mt-10">
                <h2 className="section-heading text-xl">Experience</h2>
                <div className="mt-5 space-y-8">
                  {config.experience.map((experience) => (
                    <article
                      key={`${experience.company}-${experience.position}`}
                      className="section-divider border-t pt-6 first:border-t-0 first:pt-0"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="section-heading text-lg">
                          {experience.position} <span className="text-brand-purple/70">·</span> {experience.company}
                        </h3>
                        <span className="section-body text-sm">{experience.duration}</span>
                      </div>
                      <p className="section-body mt-3 text-base leading-7">
                        {experience.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {experience.technologies.map(tech => (
                          <span key={tech} className="surface-chip rounded-full px-2.5 py-1 text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="mt-10 grid gap-10 md:grid-cols-2">
                <div>
                  <h2 className="section-heading text-xl">Education</h2>
                  <div className="mt-5 space-y-5">
                    <div>
                      <h3 className="section-heading text-lg">
                        {config.education.current.degree}
                      </h3>
                      <p className="section-body mt-1">{config.education.current.institution}</p>
                      <p className="section-body mt-1 text-sm">
                        {config.education.current.duration} · {config.education.current.graduationDate}
                      </p>
                    </div>
                    {previousEducation ? (
                      <div className="section-divider border-t pt-5">
                        <h3 className="section-heading text-lg">{previousEducation.degree}</h3>
                        <p className="section-body mt-1">{previousEducation.institution}</p>
                        <p className="section-body mt-1 text-sm">
                          {previousEducation.duration}
                          {previousEducation.graduationDate ? ` · ${previousEducation.graduationDate}` : ''}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <h2 className="section-heading text-xl">Skills</h2>
                  <div className="section-body mt-5 space-y-4 text-sm leading-7">
                    <p>
                      <span className="section-heading mb-1 block text-base font-medium">AI Systems</span>
                      <span>{[...config.skills.ml_ai].join(', ')}</span>
                    </p>
                    <p>
                      <span className="section-heading mb-1 block text-base font-medium">Web & Product</span>
                      <span>{[...config.skills.web_development].join(', ')}</span>
                    </p>
                    <p>
                      <span className="section-heading mb-1 block text-base font-medium">Languages</span>
                      <span>{[...config.skills.programming].join(', ')}</span>
                    </p>
                    <p>
                      <span className="section-heading mb-1 block text-base font-medium">Cloud & Data</span>
                      <span>{[...config.skills.databases, ...config.skills.devops_cloud, ...config.skills.big_data].join(', ')}</span>
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-10">
                <h2 className="section-heading text-xl">Selected Projects</h2>
                <div className="mt-5 space-y-6">
                  {config.projects
                    .filter((project) => project.featured)
                    .map((project) => (
                      <article key={project.title} className="section-divider border-t pt-6 first:border-t-0 first:pt-0">
                        <h3 className="section-heading flex items-center gap-2 text-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div>
                          {project.title}
                        </h3>
                        <p className="section-body ml-3.5 mt-2 text-base leading-7">
                          {project.description}
                        </p>
                      </article>
                    ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
