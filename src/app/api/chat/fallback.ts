import { getConfig } from "@/lib/config-loader";

function formatHighlights(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function findFeaturedProject(prefix: string) {
  return getConfig().projects.find(
    (project) =>
      project.featured && project.title.toLowerCase().startsWith(prefix),
  );
}

function describeProject(prefix: string) {
  const project = findFeaturedProject(prefix);

  if (!project) {
    return "That project is not currently listed in the portfolio configuration.";
  }

  const highlights = project.achievements ?? project.metrics ?? [];
  const details = highlights.length
    ? `\n\nHighlights:\n${formatHighlights(highlights)}`
    : "";

  return `**${project.title}**\n\n${project.description}\n\nTech: ${project.techStack.join(", ")}.${details}`;
}

function describeExperience() {
  const config = getConfig();

  return config.experience
    .map((experience) => {
      const highlights = experience.highlights ?? [];
      const details = highlights.length
        ? `\n${formatHighlights(highlights)}`
        : `\n${experience.description}`;

      return `**${experience.position} at ${experience.company}** (${experience.duration})${details}`;
    })
    .join("\n\n");
}

function describeSkills() {
  const { skills } = getConfig();

  return [
    `**Languages:** ${skills.programming.join(", ")}`,
    `**AI / ML:** ${skills.ml_ai.join(", ")}`,
    `**Web:** ${skills.web_development.join(", ")}`,
    `**Data:** ${skills.databases.join(", ")}`,
    `**Cloud / DevOps:** ${skills.devops_cloud.join(", ")}`,
  ].join("\n\n");
}

function describeContact(includeResume: boolean) {
  const config = getConfig();
  const lines = [
    `Email: [${config.personal.email}](mailto:${config.personal.email})`,
    `LinkedIn: [Edison Xu](${config.social.linkedin})`,
    `GitHub: [${config.personal.handle}](${config.social.github})`,
    `Location: ${config.personal.location.current}`,
  ];

  if (includeResume) {
    lines.unshift(
      `Resume: [View online](${config.resume.downloadUrl}) or [download the PDF](${config.resume.pdfUrl ?? config.resume.downloadUrl})`,
    );
  }

  return lines.join("\n\n");
}

export function getFallbackAnswer(question: string) {
  const normalized = question.toLowerCase();

  if (normalized.includes("conductor")) {
    return describeProject("conductor");
  }

  if (normalized.includes("engram") || normalized.includes("memory")) {
    return describeProject("engram");
  }

  if (
    normalized.includes("figbrain") ||
    normalized.includes("figma") ||
    normalized.includes("figjam")
  ) {
    return describeProject("figbrain");
  }

  if (
    normalized.includes("highmark") ||
    normalized.includes("experience") ||
    normalized.includes("work") ||
    normalized.includes("career")
  ) {
    return describeExperience();
  }

  if (
    normalized.includes("skill") ||
    normalized.includes("stack") ||
    normalized.includes("technology") ||
    normalized.includes("technologies")
  ) {
    return describeSkills();
  }

  const asksForResume =
    normalized.includes("resume") || normalized.includes("cv");
  const asksForContact =
    normalized.includes("contact") ||
    normalized.includes("email") ||
    normalized.includes("reach") ||
    normalized.includes("linkedin") ||
    normalized.includes("github");

  if (asksForResume || asksForContact) {
    return describeContact(asksForResume);
  }

  const config = getConfig();
  const featuredProjects = config.projects
    .filter((project) => project.featured)
    .map((project) => project.title.split(":")[0])
    .join(", ");

  return `${config.personal.bio}\n\nYou can ask about my Highmark experience, ${featuredProjects}, technical skills, resume, or contact information.`;
}
