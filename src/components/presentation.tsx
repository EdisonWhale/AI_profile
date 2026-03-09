"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { profileInfo } from "@/lib/config-loader";
import { getConfig } from "@/lib/config-loader";

interface PresentationProps {
  embedded?: boolean;
}

export function Presentation({ embedded = false }: PresentationProps) {
  const profile = profileInfo;
  const config = getConfig();
  const [imageSrc, setImageSrc] = useState(profile.src);
  const bioParagraphs = profile.description.split("\n\n").filter(Boolean);
  const workPreferenceParts = [];
  if (profile.location.remote && profile.location.relocation) {
    workPreferenceParts.push("Open to remote roles and relocation");
  } else if (profile.location.remote) {
    workPreferenceParts.push("Open to remote roles");
  } else if (profile.location.relocation) {
    workPreferenceParts.push("Open to relocation");
  }
  if (config.personal.workAuthorization?.requiresSponsorship === false) {
    workPreferenceParts.push("U.S. work authorized");
  }
  const workPreference =
    workPreferenceParts.length > 0 ? workPreferenceParts.join(" · ") : null;

  const details: { label: string; value: string }[] = [
    { label: "Based in", value: profile.location.current },
    ...(workPreference
      ? [{ label: "Work preference", value: workPreference }]
      : []),
  ];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="surface-panel card-hover relative mx-auto aspect-4/5 w-full max-w-md overflow-hidden"
      >
        <Image
          src={imageSrc}
          alt={profile.name}
          width={900}
          height={1125}
          className="h-full w-full object-cover object-center"
          onError={() => setImageSrc(profile.fallbackSrc)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          {!embedded ? (
            <>
              <p className="section-eyebrow">About</p>
              <h3 className="section-heading text-2xl tracking-[-0.02em] md:text-3xl">
                I build production-grade AI products people actually use.
              </h3>
            </>
          ) : null}
          <div className="section-body space-y-4 text-base leading-7">
            {bioParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="section-divider grid gap-4 border-t pt-6 text-sm sm:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label} className="space-y-1">
              <p className="section-eyebrow">{detail.label}</p>
              <p className="text-(--panel-body-strong) text-sm">{detail.value}</p>
            </div>
          ))}
        </div>

        <div className="section-divider grid gap-4 border-t pt-6 sm:grid-cols-3">
          {[
            {
              label: "Current focus",
              value:
                "AI products, agent workflows, retrieval systems, and production engineering",
            },
            {
              label: "How I work",
              value:
                "Product-minded, highly ownership-driven, and comfortable shipping end-to-end",
            },
            {
              label: "Looking for",
              value:
                "Software engineering roles focused on AI products, intelligent workflows, and user-facing platforms",
            },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <p className="section-eyebrow">{item.label}</p>
              <p className="text-(--panel-body-strong) text-sm leading-6">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Presentation;
