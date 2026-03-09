"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getConfig } from "@/lib/config-loader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AllProjectsProps {
  featuredOnly?: boolean;
  limit?: number;
  showHeading?: boolean;
  layout?: "default" | "chat-rail";
}

export default function AllProjects({
  featuredOnly = false,
  limit,
  showHeading = true,
  layout = "default",
}: AllProjectsProps) {
  const config = getConfig();
  const projects = (featuredOnly
    ? config.projects.filter((project) => project.featured)
    : config.projects
  ).slice(0, limit);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const isChatRail = layout === "chat-rail";
  const hasMultipleProjects = projects.length > 1;

  const clampIndex = useCallback(
    (index: number) => Math.max(0, Math.min(index, projects.length - 1)),
    [projects.length]
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const nextIndex = clampIndex(index);
      const card = cardRefs.current[nextIndex];

      if (!card) return;

      card.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
      setActiveIndex(nextIndex);
    },
    [clampIndex]
  );

  useEffect(() => {
    if (!isChatRail || !scrollRef.current || projects.length <= 1) return;

    const container = scrollRef.current;

    const updateActiveIndex = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    updateActiveIndex();
    container.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      container.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [isChatRail, projects.length]);

  const headerDescription = useMemo(() => {
    if (isChatRail) {
      return "Browse a concise snapshot of recent work. Swipe or use the arrows to move between projects.";
    }

    return "A few projects that best represent how I think about product, systems, and measurable engineering impact.";
  }, [isChatRail]);

  if (isChatRail) {
    return (
      <div className="space-y-5">
        {showHeading ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="eyebrow">Projects</p>
              <h2 className="section-title">Selected work</h2>
              <p className="section-copy max-w-2xl">{headerDescription}</p>
            </div>

            {hasMultipleProjects ? (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-(--panel-body) min-w-14 text-sm">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-(--button-border) bg-surface/80 text-(--panel-body-strong) hover:bg-surface-subtle"
                  onClick={() => scrollToIndex(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Show previous project"
                >
                  <ChevronLeft />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-(--button-border) bg-surface/80 text-(--panel-body-strong) hover:bg-surface-subtle"
                  onClick={() => scrollToIndex(activeIndex + 1)}
                  disabled={activeIndex === projects.length - 1}
                  aria-label="Show next project"
                >
                  <ChevronRight />
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}

        <div
          ref={scrollRef}
          className="project-rail-scroll -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3"
          aria-label="Project carousel"
        >
          {projects.map((project, index) => {
            const leadMetric = project.metrics?.[0];
            const supportingMetrics = leadMetric
              ? project.metrics?.slice(1, 3) ?? []
              : project.metrics?.slice(0, 2) ?? [];
            const topAchievements = project.achievements?.slice(0, 2) ?? [];
            const visibleLinks = project.links?.slice(0, 2) ?? [];

            return (
              <article
                key={project.title}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="feature-card chat-project-card flex min-w-[84%] snap-start flex-col overflow-hidden p-0 sm:min-w-120 lg:min-w-136"
              >
                {project.images?.[0] ? (
                  <div className="feature-card-media aspect-video rounded-none rounded-t-[inherit]">
                    <Image
                      src={project.images[0].src}
                      alt={project.images[0].alt}
                      width={1200}
                      height={900}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="space-y-5 p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                      <p className="section-eyebrow">
                        {project.category} · {project.date}
                      </p>
                      <h3 className="section-heading text-xl tracking-[-0.02em] md:text-2xl">
                        {project.title}
                      </h3>
                    </div>

                    {leadMetric ? (
                      <div className="feature-callout max-w-56 text-xs font-medium sm:text-sm">
                        <span
                          className="h-2 w-2 rounded-full bg-brand"
                          aria-hidden="true"
                        />
                        <span>{leadMetric}</span>
                      </div>
                    ) : null}
                  </div>

                  <p className="section-body text-sm leading-7 md:text-[0.98rem] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                    {project.description}
                  </p>

                  {supportingMetrics.length ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {supportingMetrics.map((metric) => (
                        <div
                          key={metric}
                          className="feature-metric text-(--panel-body-strong) px-3.5 py-2.5 text-xs sm:text-sm"
                        >
                          {metric}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="surface-chip px-3 py-1.5 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 5 ? (
                      <span className="surface-chip px-3 py-1.5 text-xs font-medium">
                        +{project.techStack.length - 5} more
                      </span>
                    ) : null}
                  </div>

                  {topAchievements.length ? (
                    <ul className="section-divider text-(--panel-body-strong) space-y-2 border-t pt-4 text-sm leading-6">
                      {topAchievements.map((achievement) => (
                        <li key={achievement}>{achievement}</li>
                      ))}
                    </ul>
                  ) : null}

                  {visibleLinks.length ? (
                    <div className="section-divider flex flex-wrap gap-3 border-t pt-4">
                      {visibleLinks.map((link) => (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          key={link.url}
                          className="border-(--button-border) bg-surface text-(--panel-body-strong) transition-colors hover:bg-surface-subtle hover:text-(--panel-body-strong)"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.name}
                          </a>
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {hasMultipleProjects ? (
          <div className="flex items-center justify-center gap-2">
            {projects.map((project, index) => (
              <button
                type="button"
                key={project.title}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-200",
                  activeIndex === index
                    ? "bg-brand w-6"
                    : "bg-(--surface-chip-border) hover:bg-(--button-border) w-2.5"
                )}
                aria-label={`View project ${index + 1}`}
                aria-pressed={activeIndex === index}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showHeading ? (
        <div className="space-y-3">
          <p className="eyebrow">Projects</p>
          <h2 className="section-title">Selected work</h2>
          <p className="section-copy max-w-2xl">
            {headerDescription}
          </p>
        </div>
      ) : null}

      <div className="space-y-8">
        {projects.map((project, index) => {
          const leadMetric = project.metrics?.[0];
          const supportingMetrics = leadMetric
            ? project.metrics?.slice(1, 5) ?? []
            : project.metrics?.slice(0, 4) ?? [];
          const isReversed = index % 2 === 1;

          return (
            <article
              key={project.title}
              className={cn(
                "feature-card p-6 md:p-8",
                index === 0 && "feature-card-spotlight"
              )}
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start">
                <div
                  className={cn(
                    "feature-card-body space-y-6",
                    isReversed && "lg:order-2"
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl space-y-3">
                      <p className="section-eyebrow">
                        {project.category} · {project.date}
                      </p>
                      <h3 className="section-heading text-2xl tracking-[-0.02em] md:text-3xl">
                        {project.title}
                      </h3>
                    </div>

                    {leadMetric ? (
                      <div className="feature-callout text-sm font-medium">
                        <span
                          className="h-2 w-2 rounded-full bg-brand"
                          aria-hidden="true"
                        />
                        <span>{leadMetric}</span>
                      </div>
                    ) : null}
                  </div>

                  <p className="section-body max-w-2xl text-base leading-8 md:text-[1.02rem]">
                    {project.description}
                  </p>

                  {supportingMetrics.length ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {supportingMetrics.map((metric) => (
                        <div
                          key={metric}
                          className="feature-metric text-(--panel-body-strong) px-4 py-3 text-sm"
                        >
                          {metric}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {project.achievements?.length ? (
                    <ul className="feature-achievements section-divider text-(--panel-body-strong) space-y-3 border-t pt-5 text-sm leading-6">
                      {project.achievements.slice(0, 3).map((achievement) => (
                        <li key={achievement}>{achievement}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div
                  className={cn(
                    "feature-card-side space-y-4",
                    isReversed && "lg:order-1"
                  )}
                >
                  {project.images?.[0] ? (
                    <div className="feature-card-media">
                      <Image
                        src={project.images[0].src}
                        alt={project.images[0].alt}
                        width={1200}
                        height={900}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="feature-card-panel space-y-4 p-5">
                    <p className="section-eyebrow">Tech stack</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 8).map((tech) => (
                        <span
                          key={tech}
                          className="surface-chip px-3 py-1.5 text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {project.links?.length ? (
                      <div className="section-divider flex flex-wrap gap-3 border-t pt-4">
                        {project.links.map((link) => (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            key={link.url}
                            className="border-(--button-border) bg-surface text-(--panel-body-strong) transition-colors hover:bg-surface-subtle hover:text-(--panel-body-strong)"
                          >
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.name}
                            </a>
                          </Button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
