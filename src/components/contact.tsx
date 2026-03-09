'use client';

import { contactInfo } from '@/lib/config-loader';
import { Button } from '@/components/ui/button';

export function Contact() {
  return (
    <div className="glass-card card-hover p-6 md:p-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-5">
          <p className="section-eyebrow">Let&apos;s connect</p>
          <h3 className="section-heading text-3xl tracking-[-0.02em] md:text-4xl">
            Interested in AI systems, product engineering, or a team that ships ambitious work well?
          </h3>
          <p className="section-body max-w-2xl text-base leading-7">
            I&apos;m always happy to talk about thoughtful engineering, product-minded AI work,
            and the kinds of technical challenges that benefit from both system design and
            user empathy.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <p className="section-eyebrow">
              Direct
            </p>
            <a
              className="text-(--panel-body-strong) block text-lg font-medium transition-colors hover:text-brand"
              href={`mailto:${contactInfo.email}`}
            >
              {contactInfo.email}
            </a>
            {contactInfo.phone ? (
              <a
                className="section-body hover:text-(--panel-body-strong) block text-base transition-colors"
                href={`tel:${contactInfo.phone}`}
              >
                {contactInfo.phone}
              </a>
            ) : null}
            <p className="section-body text-sm">{contactInfo.handle}</p>
          </div>

          <div className="section-divider space-y-3 border-t pt-6">
            <p className="section-eyebrow">
              Social
            </p>
            <div className="flex flex-wrap gap-4">
              {contactInfo.socials.map((social) => (
                <a
                  key={social.name}
                  className="section-body text-sm transition-colors hover:text-brand"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="solid-ai-btn sm:flex-1 rounded-xl">
              <a href={`mailto:${contactInfo.email}`}>Email me</a>
            </Button>
            <Button asChild className="glass-btn sm:flex-1 rounded-xl">
              <a href="/resume">View resume</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
