import { getConfig } from '@/lib/config-loader';

export default function ResumePage() {
  const config = getConfig();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-slate-900">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-bold">{config.personal.name}</h1>
        <p className="mt-2 text-lg text-slate-600">{config.personal.title}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
          <span>{config.personal.email}</span>
          {config.personal.phone ? <span>{config.personal.phone}</span> : null}
          <span>{config.personal.location.current}</span>
          <a
            href={config.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            LinkedIn
          </a>
          <a
            href={config.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub
          </a>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
          {config.personal.bio}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Experience</h2>
        <div className="mt-4 space-y-5">
          {config.experience.map((experience) => (
            <article key={`${experience.company}-${experience.position}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-medium">
                  {experience.position} · {experience.company}
                </h3>
                <span className="text-sm text-slate-500">{experience.duration}</span>
              </div>
              <p className="mt-2 text-slate-700">{experience.description}</p>
              <p className="mt-2 text-sm text-slate-500">
                {experience.technologies.join(', ')}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Education</h2>
        <div className="mt-4">
          <h3 className="text-lg font-medium">
            {config.education.current.degree}
          </h3>
          <p className="text-slate-700">{config.education.current.institution}</p>
          <p className="text-sm text-slate-500">
            {config.education.current.duration} · {config.education.current.graduationDate}
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Skills</h2>
        <p className="mt-3 text-slate-700">
          {[
            ...config.skills.programming,
            ...config.skills.ml_ai,
            ...config.skills.web_development,
            ...config.skills.databases,
            ...config.skills.devops_cloud,
          ].join(', ')}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Selected Projects</h2>
        <div className="mt-4 space-y-4">
          {config.projects
            .filter((project) => project.featured)
            .map((project) => (
              <article key={project.title}>
                <h3 className="text-lg font-medium">{project.title}</h3>
                <p className="mt-1 text-slate-700">{project.description}</p>
              </article>
            ))}
        </div>
      </section>
    </main>
  );
}
