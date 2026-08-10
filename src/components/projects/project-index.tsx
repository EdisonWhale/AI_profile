import type { Project } from "@/types/portfolio";

interface ProjectIndexProps {
  label: string;
  projects: Project[];
  startIndex: number;
  track: Project["track"];
}

export function ProjectIndex({
  label,
  projects,
  startIndex,
  track,
}: ProjectIndexProps) {
  return (
    <section
      className="quiet-project-group"
      aria-labelledby={`project-track-${track}`}
    >
      <header className="quiet-project-group-header">
        <h2 id={`project-track-${track}`}>{label}</h2>
        <p>{projects.length} projects</p>
      </header>

      <div className="quiet-project-list">
        {projects.map((project, offset) => (
          <details className="quiet-project-disclosure" key={project.title}>
            <summary>
              <span className="quiet-project-number" aria-hidden="true">
                {String(startIndex + offset + 1).padStart(2, "0")}
              </span>
              <span className="quiet-project-heading">
                <strong>{project.title}</strong>
                <span>{project.category}</span>
              </span>
              <span className="quiet-project-date">{project.date}</span>
              <span className="quiet-project-summary">{project.summary}</span>
            </summary>

            <div className="quiet-project-detail">
              <div className="quiet-project-facts">
                <div>
                  <h3>Tech stack</h3>
                  <p>{project.techStack.join(", ")}</p>
                </div>
                {project.links?.length ? (
                  <div>
                    <h3>Links</h3>
                    <ul>
                      {project.links.map((link) => (
                        <li key={link.url}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="quiet-project-evidence">
                <div>
                  <h3>Description</h3>
                  <p>{project.description}</p>
                </div>
                {project.achievements?.length ? (
                  <div>
                    <h3>Achievements</h3>
                    <ul>
                      {project.achievements.map((achievement) => (
                        <li key={achievement}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {project.metrics?.length ? (
                  <div>
                    <h3>Metrics</h3>
                    <ul className="quiet-project-metrics">
                      {project.metrics.map((metric) => (
                        <li key={metric}>{metric}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
