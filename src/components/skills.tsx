"use client";

import { getConfig } from "@/lib/config-loader";

export default function Skills() {
  const config = getConfig();
  const groups = [
    { title: "Applied AI", values: config.skills.ml_ai.slice(0, 6) },
    { title: "Languages", values: config.skills.programming },
    { title: "Web", values: config.skills.web_development.slice(0, 6) },
    { title: "Cloud and data", values: [...config.skills.databases, ...config.skills.devops_cloud.slice(0, 5)] },
  ];

  return (
    <section className="quiet-tool-surface" aria-label="Skills">
      <div className="quiet-tool-list">
        {groups.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.values.join(", ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
