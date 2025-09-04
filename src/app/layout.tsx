import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Edison Xu - Full-stack Python Developer & AI Engineer | Professional Portfolio",
    template: "%s | Edison Xu Portfolio"
  },
  description: "Professional portfolio of Edison Xu - Full-stack Developer & AI Engineer. Available for entry-level/ junior Software Engineering/ AI/ ML Engineering roles.",
  keywords: [
    "Edison Xu",
    "Full-stack Developer", 
    "Python Developer",
    "AI Engineer",
    "Portfolio",
    "Software Developer",
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
    "Professional Portfolio",
    "Developer Portfolio",
    "Tech Portfolio",
    "entry-level software engineering",
    "junior AI/ML engineer",
    "Python Automation",
    "Web Scraping",
    "API Development",
    "AI/ML Engineer",
    "AI/ML Developer",
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
    title: "Edison Xu - Full-stack Developer & AI Engineer | Professional Portfolio",
    description: "Professional portfolio showcasing AI-powered projects, and full-stack development. Available for entry-level/ junior Software Engineering/ AI/ ML Engineering roles.",
    siteName: "Edison Xu Portfolio",
    images: [
      {
        url: "https://edisonwhale.com/portfolio.png",
        width: 1200,
        height: 630,
        alt: "Edison Xu - Professional Portfolio with AI Chatbot",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edison Xu - Full-stack Python Developer & AI Engineer",
    description: "Professional portfolio showcasing AI projects, IoT systems, and automation solutions. SIH 2025 Finalist available for internships.",
    creator: "@edisonwhale",
    site: "@edisonwhale",
    images: [{
      url: "https://edisonwhale.com/portfolio.png",
      alt: "Edison Xu Professional Portfolio"
    }],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      }
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/apple-touch-icon.svg?v=2",
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://edisonwhale.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Edison Xu",
              "jobTitle": "Full-stack Python Developer & AI Engineer",
              "url": "https://edisonwhale.com/",
              "image": "https://edisonwhale.com/profile.jpeg",
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
              "description": "Full-stack Developer & AI Engineer with expertise in building AI-powered solutions."
            })
          }}
        />
      </head>
      <body
        className="min-h-screen bg-background font-sans antialiased"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
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