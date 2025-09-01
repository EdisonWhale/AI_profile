import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getConfig } from "@/lib/config-loader";
import "./globals.css";

// Load Inter font for non-Apple devices
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

// Get configuration
const config = getConfig();

export const metadata: Metadata = {
  title: {
    default: `${config.personal.name} - ${config.personal.title} | Professional Portfolio`,
    template: `%s | ${config.personal.name} Portfolio`
  },
  description: config.personal.bio.split('\n').join(' '),
  keywords: [
    config.personal.name,
    "Full-stack Developer", 
    "Software Development Engineer",
    "AI/ML Engineer",
    "Portfolio",
    "Machine Learning",
    "Web Development",
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "Java",
    "Go",
    "AI Development",
    "Vertex AI",
    "Gemini API",
    "Professional Portfolio",
    "Developer Portfolio",
    "Tech Portfolio",
    "Internship",
    "Python Automation",
    "Web Scraping",
    "API Development"
  ],
  authors: [
    {
      name: config.personal.name,
      url: config.social.website || `https://${config.personal.handle.replace('@', '')}.com`,
    },
  ],
  creator: config.personal.name,
  publisher: config.personal.name,
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
    url: config.social.website || "https://www.edisonwhale.com",
    title: `${config.personal.name} - ${config.personal.title} | Professional Portfolio`,
    description: config.personal.bio.split('\n').join(' '),
    siteName: `${config.personal.name} Portfolio`,
    images: [
      {
        url: `${config.social.website || "https://www.edisonwhale.com"}/portfolio.png`,
        width: 1200,
        height: 630,
        alt: `${config.personal.name} - Professional Portfolio with AI Chatbot`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.personal.name} - ${config.personal.title}`,
    description: config.personal.bio.split('\n').join(' ').substring(0, 160),
    creator: config.personal.handle,
    site: config.personal.handle,
    images: [{
      url: `${config.social.website || "https://www.edisonwhale.com"}/portfolio.png`,
      alt: `${config.personal.name} Professional Portfolio`
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
    canonical: config.social.website || "https://www.edisonwhale.com",
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
        <link rel="canonical" href={config.social.website || "https://www.edisonwhale.com"} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": config.personal.name,
              "jobTitle": config.personal.title,
              "url": config.social.website || "https://www.edisonwhale.com",
              "image": `${config.social.website || "https://www.edisonwhale.com"}${config.personal.avatar}`,
              "sameAs": [
                config.social.github,
                config.social.linkedin,
                config.social.twitter
              ].filter(Boolean),
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
                "IoT Systems",
                "Web Development",
                "Automation",
                "Full Stack Development"
              ],
              "description": "Full-stack Python Developer & AI Engineer with expertise in building AI-powered solutions, IoT systems, and automation tools. SIH 2025 Finalist with 25+ delivered projects."
            })
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
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
        <Analytics />
      </body>
    </html>
  );
}