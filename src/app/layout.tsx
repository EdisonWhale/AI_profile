import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Edison Xu | Software Engineer and AI Systems Builder",
    template: "%s | Edison Xu",
  },
  description:
    "Portfolio of Edison Xu, a software engineer building production AI systems, full-stack applications, and enterprise-ready developer tools.",
  keywords: [
    "Edison Xu",
    "Software Engineer",
    "Full-stack Developer",
    "AI Engineer",
    "AI Systems",
    "Portfolio",
    "Machine Learning",
    "Web Development",
    "Next.js",
    "React",
    "FastAPI",
    "LLM",
    "Automation",
    "LangChain",
    "AI Hackathon",
    "LangGraph",
    "AI Chatbot",
    "Developer Portfolio",
    "Tech Portfolio",
    "Generative AI",
    "Multi-Agent Systems",
    "API Development",
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
    title: "Edison Xu | Software Engineer and AI Systems Builder",
    description:
      "A warm, editorial portfolio showcasing AI systems, full-stack engineering, and production-minded product work.",
    siteName: "Edison Xu",
    images: [
      {
        url: "https://edisonwhale.com/portfolio.png",
        width: 1200,
        height: 630,
        alt: "Edison Xu portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edison Xu | Software Engineer and AI Systems Builder",
    description:
      "AI systems, full-stack engineering, and enterprise product work by Edison Xu.",
    creator: "@edisonwhale",
    site: "@edisonwhale",
    images: [{
      url: "https://edisonwhale.com/portfolio.png",
      alt: "Edison Xu portfolio",
    }],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      }
    ],
    shortcut: "/favicon.ico",
    apple: "/avatar.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://edisonwhale.com/",
  },
  category: "technology",
  classification: "Portfolio Website",
  other: {
    "google-site-verification": "your-google-verification-code-here",
  },
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
              "name": "Edison Xu",
              "jobTitle": "Software Engineer",
              "url": "https://edisonwhale.com/",
              "image": "https://edisonwhale.com/avatar.png",
              "sameAs": [
                "https://github.com/edisonwhale",
                "https://linkedin.com/in/edisonwhale",
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              },
              "alumniOf": {
                "@type": "Organization",
                "name": "SATI"
              },
              "knowsAbout": [
                "Python Development",
                "AI Engineering",
                "Machine Learning",
                "Web Development",
                "Automation",
                "Full Stack Development"
              ],
              "description": "Software engineer building production AI systems, full-stack applications, and developer-focused tools."
            })
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
          <main className="flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}