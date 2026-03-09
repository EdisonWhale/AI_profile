'use client';

import React, { useMemo, useState } from 'react';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { getConfig } from '@/lib/config-loader';
import { Button } from '@/components/ui/button';

interface ResumeProps {
  embedded?: boolean;
}

export function Resume({ embedded = false }: ResumeProps) {
  const config = getConfig();
  const resumeDetails = config.resume;
  const [previewUnavailable, setPreviewUnavailable] = useState(false);
  const highlights = [
    'Software Engineer on the Generative AI team at Highmark',
    'MS in Computational Science & Engineering from Georgia Tech',
    'US Citizen, no sponsorship required',
    'Hands-on experience across AI systems, full-stack engineering, and cloud deployment',
  ];
  const resumePreviewUrl = useMemo(() => {
    const baseUrl = resumeDetails.pdfUrl || resumeDetails.downloadUrl;

    if (!baseUrl) return '';

    return `${baseUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
  }, [resumeDetails.downloadUrl, resumeDetails.pdfUrl]);
  const canEmbedPreview = Boolean(resumePreviewUrl) && !previewUnavailable;

  const handleDownload = () => {
    window.open(resumeDetails.downloadUrl, '_blank');
  };

  const handlePdfDownload = () => {
    if (resumeDetails.pdfUrl) {
      const link = document.createElement('a');
      link.href = resumeDetails.pdfUrl;
      link.download = 'Edison_Xu_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(resumeDetails.downloadUrl, '_blank');
    }
  };

  return (
    <div className="surface-card relative overflow-hidden rounded-4xl p-6 md:p-8">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-linear-to-br from-brand-blue to-purple-600 blur-3xl"></div>
      </div>
      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            {!embedded ? (
              <>
                <p className="section-eyebrow">Resume</p>
                <h3 className="section-heading text-2xl tracking-[-0.02em] md:text-3xl">
                  A concise summary of the work, systems, and responsibilities I want to keep building.
                </h3>
              </>
            ) : null}
            <p className="section-body text-base leading-7">
              {resumeDetails.description}
            </p>
          </div>

          <ul className="section-divider space-y-3 border-t pt-6">
            {highlights.map((highlight) => (
              <li key={highlight} className="text-(--panel-body-strong) flex items-start gap-3 text-sm leading-6">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0"></div>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-panel rounded-3xl p-6 backdrop-blur-sm">
          <div className="space-y-3">
            <p className="section-eyebrow tracking-[0.18em]">
              Document details
            </p>
            <div className="text-(--panel-body-strong) space-y-2 text-sm">
              <p className="font-medium">{resumeDetails.title}</p>
              <p className="section-body">
                {resumeDetails.fileType} · Updated {resumeDetails.lastUpdated} · {resumeDetails.fileSize}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleDownload} variant="outline" className="apple-button-press glass-btn sm:flex-1">
              Open full resume
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button onClick={handlePdfDownload} variant="outline" className="apple-button-press border-(--button-border) text-(--panel-body-strong) hover:bg-surface-subtle sm:flex-1">
              Download PDF
              <Download className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="section-divider mt-6 border-t pt-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="section-eyebrow tracking-[0.18em]">Preview</p>
                <p className="section-body mt-1 text-sm">
                  A quick in-card look at the PDF resume.
                </p>
              </div>
              <div className="surface-chip flex items-center gap-2 px-3 py-1.5 text-xs font-medium">
                <FileText className="h-3.5 w-3.5" />
                <span>PDF</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.6rem] border border-(--surface-divider) bg-linear-to-b from-white/90 to-white/70 shadow-[0_18px_48px_rgba(15,23,42,0.08)] dark:from-white/8 dark:to-white/4 dark:shadow-[0_18px_48px_rgba(0,0,0,0.24)]">
              <div className="flex items-center justify-between border-b border-(--surface-divider) px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-300/80 dark:bg-rose-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80 dark:bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80 dark:bg-emerald-400/70" />
                </div>
                <p className="text-(--panel-body) truncate text-xs">
                  {resumeDetails.title}
                </p>
              </div>

              <div className="relative aspect-8.5/11 bg-[color-mix(in_srgb,var(--surface)_92%,white_8%)]">
                {canEmbedPreview ? (
                  <iframe
                    src={resumePreviewUrl}
                    title="Resume PDF preview"
                    className="h-full w-full"
                    onError={() => setPreviewUnavailable(true)}
                  />
                ) : (
                  <div className="flex h-full flex-col bg-linear-to-b from-white to-surface-subtle p-5 text-left dark:from-[#161628] dark:to-[#111122]">
                    <div className="border-b border-(--surface-divider) pb-3">
                      <p className="text-(--panel-heading) text-sm font-semibold">
                        Edison Xu
                      </p>
                      <p className="section-body mt-1 text-[11px] leading-5">
                        Software Engineer, Generative AI
                      </p>
                    </div>

                    <div className="space-y-3 pt-4">
                      <div className="space-y-1.5">
                        <div className="bg-(--panel-heading)/12 h-2.5 w-28 rounded-full dark:bg-white/16" />
                        <div className="bg-(--panel-body)/18 h-2 w-full rounded-full dark:bg-white/10" />
                        <div className="bg-(--panel-body)/18 h-2 w-[92%] rounded-full dark:bg-white/10" />
                      </div>

                      <div className="space-y-2 rounded-2xl border border-(--surface-divider) p-3">
                        <div className="bg-(--panel-heading)/12 h-2.5 w-24 rounded-full dark:bg-white/16" />
                        <div className="space-y-1.5">
                          {highlights.slice(0, 3).map((highlight) => (
                            <div key={highlight} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand" />
                              <span className="section-body line-clamp-2 text-[11px] leading-5">
                                {highlight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-2xl border border-(--surface-divider) p-3">
                          <div className="bg-(--panel-heading)/12 mb-2 h-2.5 w-18 rounded-full dark:bg-white/16" />
                          <div className="space-y-1.5">
                            <div className="bg-(--panel-body)/18 h-2 w-full rounded-full dark:bg-white/10" />
                            <div className="bg-(--panel-body)/18 h-2 w-[82%] rounded-full dark:bg-white/10" />
                          </div>
                        </div>
                        <div className="rounded-2xl border border-(--surface-divider) p-3">
                          <div className="bg-(--panel-heading)/12 mb-2 h-2.5 w-20 rounded-full dark:bg-white/16" />
                          <div className="flex flex-wrap gap-1.5">
                            {['LLMs', 'Python', 'Next.js', 'AWS'].map((item) => (
                              <span
                                key={item}
                                className="surface-chip px-2 py-1 text-[10px] font-medium"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-white via-white/72 to-transparent dark:from-[#111122] dark:via-[#111122]/68" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resume;