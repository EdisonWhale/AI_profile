import type { Metadata } from "next";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { PageViewTracker } from "@/components/tracking/page-view-tracker";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Edison Xu | Software Engineer, Generative AI",
    template: "%s | Edison Xu",
  },
  description:
    "Portfolio of Edison Xu, a software engineer building real-time AI training, agent evaluation, and enterprise retrieval systems.",
  keywords: [
    "Edison Xu",
    "Software Engineer",
    "Full-stack Developer",
    "AI Engineer",
    "Generative AI",
    "Multi-Agent Systems",
    "LLM Evaluation",
    "RAG",
    "Distributed Systems",
  ],
  authors: [
    {
      name: "Edison Xu",
      url: "https://edisonwhale.com/",
    },
  ],
  creator: "Edison Xu",
  publisher: "Edison Xu",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edisonwhale.com/",
    title: "Edison Xu | Software Engineer, Generative AI",
    description:
      "Production AI experience and projects spanning agent runtimes, evaluation, memory, and enterprise retrieval.",
    siteName: "Edison Xu",
  },
  twitter: {
    card: "summary",
    title: "Edison Xu | Software Engineer, Generative AI",
    description:
      "Production AI experience and projects spanning agent runtimes, evaluation, memory, and enterprise retrieval.",
    creator: "@edisonwhale",
    site: "@edisonwhale",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://edisonwhale.com/",
  },
  category: "technology",
  classification: "Portfolio Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="canonical" href="https://edisonwhale.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Edison Xu",
              jobTitle: "Software Engineer",
              url: "https://edisonwhale.com/",
              sameAs: [
                "https://github.com/edisonwhale",
                "https://linkedin.com/in/edisonwhale",
              ],
              worksFor: {
                "@type": "Organization",
                name: "Highmark Health",
              },
              alumniOf: {
                "@type": "Organization",
                name: "Georgia Institute of Technology",
              },
              knowsAbout: [
                "Python Development",
                "AI Engineering",
                "Machine Learning",
                "Web Development",
                "Automation",
                "Full Stack Development",
              ],
              description:
                "Software engineer building real-time AI training, agent evaluation, and enterprise retrieval systems.",
            }),
          }}
        />
      </head>
      <body className="min-h-screen font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem={false}
          storageKey="portfolio-theme"
        >
          <main className="flex min-h-screen flex-col">{children}</main>
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
