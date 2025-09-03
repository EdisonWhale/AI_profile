# Edison Xu — AI-Powered Portfolio

Modern, AI-augmented developer portfolio for Edison Xu. The site is fully driven by a single JSON configuration, features an AI chat experience powered by Google Gemini, and uses an Apple-inspired visual design.

This README documents this specific implementation, its configuration, architecture, and how to run and customize it.

**Live Routes**
- Home: `/`
- AI Chat: `/chat` (supports `?q=...` to prefill an initial question)

**Highlights**
- JSON-first content via `portfolio-config.json`
- AI chat with tool-augmented answers (Gemini + Vercel AI SDK)
- Apple-style UI with framer-motion animations
- Strong typing and config helpers for safety and reuse

**Screenshot Assets**
- Replace `public/profile.jpeg` and `public/avatar.png` to customize visuals

**License**
- MIT (see `docs/LICENSE`)

---

**What’s Inside**
- Strongly typed configuration pipeline (TypeScript)
- Next.js 15 App Router with React 19
- Tailwind CSS v4 and Radix UI primitives
- AI chat backed by `ai` SDK and `@ai-sdk/google`
- Prebuilt sections: Presentation, Skills, Projects, Resume, Contact, Availability

---

**Project Structure**
- `portfolio-config.json`: Single source of truth for content (name, bio, skills, projects, resume, chatbot, etc.)
- `public/`: Static assets (profile image, favicon, resume PDF)
- `src/app/`: Next.js routes, layout, global styles
- `src/app/chat`: Dedicated chat page
- `src/app/api/chat`: AI chat API route and tools
- `src/components/`: UI components (landing, chat, sections, UI primitives)
- `src/lib/`: Config loader and parser utilities
- `src/types/portfolio.ts`: Strongly typed config schema

---

**Configuration System**
- Loader: `src/lib/config-loader.ts`
  - Imports `portfolio-config.json` at build time
  - Exposes helpers like `getConfig()`, `getConfigParser()` and pre-parsed exports
- Parser: `src/lib/config-parser.ts`
  - Generates derived data:
    - `systemPrompt`: AI system prompt personalized to Edison
    - `contactInfo`, `profileInfo`, `skillsData`, `projectData`
    - `presetReplies`, `resumeDetails`, `entryLevelInfo`
- Types: `src/types/portfolio.ts`
  - Defines `PortfolioConfig` and all nested types (Personal, Education, Experience, Skills, Project, Resume, Chatbot, etc.)

Update content by editing `portfolio-config.json`. Example excerpts from this repo:
- Personal: name, title, location, bio, avatar
- Skills: programming, ml_ai, web_development, databases, devops_cloud, big_data, soft_skills
- Projects: title, category, description, techStack, featured, links/images
- Resume: title, description, lastUpdated, `downloadUrl`
- Chatbot: name, tone, topics, presetQuestions

---

**AI Chatbot**
- API: `src/app/api/chat/route.ts`
  - Model: `google('gemini-2.5-flash-lite')` via `@ai-sdk/google`
  - System prompt: generated from `portfolio-config.json`
  - Tools: structured data fetchers mapped to UI renderers
    - `getProjects`, `getPresentation`, `getResume`, `getContact`, `getSkills`, `getEntryLevel`
  - Streams responses using the `ai` SDK’s `streamText` and UI message stream response
- Client UI: `src/components/chat/*`
  - `chat.tsx`: Orchestrates the chat experience with `useChat` and DefaultChatTransport
  - `simple-chat-view.tsx`: Renders assistant text + active tool output
  - `tool-renderer.tsx`: Maps tool outputs to rich components:
    - Presentation → `components/presentation`
    - Skills → `components/skills`
    - Projects → `components/projects/*`
    - Resume → `components/resume`
    - Availability/Entry-Level → `components/AvailabilityCard`
    - Contact → `components/contact`
  - `HelperBoost.tsx`: Quick question launcher with grouped suggestions

Behavior:
- `/chat?q=...` auto-submits the initial query
- Assistant follows a “use tools + natural reply” pattern enforced by the system prompt
- Preset replies are generated from config (`presetReplies`) and can be shown as helpers

---

**Landing Experience**
- `src/components/landing/landing-page.tsx` renders:
  - Animated avatar, search input (routes to `/chat?q=...`), primary CTA “Meet AI Edison”, and resume downloader
  - Status indicator driven by `entryLevel.currentStatus`
  - Apple-style animated background and glass effects (`src/app/globals.css`)

---

**Tech Stack**
- Framework: `next@15`, `react@19`, `typescript`
- Styling: `tailwindcss@4`, custom Apple-inspired CSS in `globals.css`
- Motion/UI: `framer-motion`, `radix-ui`, `lucide-react`
- AI: `ai@^5`, `@ai-sdk/google` (Gemini), `zod` for tool input schemas
- Analytics: `@vercel/analytics` (optional)

---

**Install & Run**
- Prereqs: Node 18+ recommended
- Install: `pnpm install` or `npm install` or `yarn install`
- Env vars: copy `.env.example` → `.env.local` and set:
  - `GOOGLE_GENERATIVE_AI_API_KEY` (required for chat)
  - `NEXT_PUBLIC_SITE_URL` (optional)
- Dev: `npm run dev` then open `http://localhost:3000`
- Build: `npm run build`, Start: `npm start`

Security note: never commit `.env.local` with real keys. If a key was committed, rotate it immediately from Google AI Studio and force-push without secrets.

---

**Customization**
- Content: edit `portfolio-config.json`
- Images: replace files in `public/` (e.g., `profile.jpeg`, `avatar.png`, `Edison-resume-2025.pdf`)
- SEO: adjust `src/app/layout.tsx` metadata (OpenGraph, Twitter cards, canonical). Replace any leftover external preview URLs with your own (`public/portfolio.png`).
- Images from remote hosts: see `next.config.ts` `images.remotePatterns`
- Styling: tweak `globals.css` or Tailwind utilities; theme is intentionally minimal and Apple-inspired

---

**Notable Features & Details**
- JSON-only configuration with runtime-safe parsing and typed accessors
- AI tools return structured data that the UI renders as rich, scannable cards
- Dedicated `/chat` route with initial-query support and animated avatar header
- Helper quick-questions with grouped categories and mobile-friendly drawer
- Resume viewer supports external PDF via iframe or local file

---

**Directory Reference**
- `src/lib/config-loader.ts`: Imports JSON and exports typed getters and derived data
- `src/lib/config-parser.ts`: Builds the AI system prompt and UI-friendly slices
- `src/app/api/chat/tools/*`: Zod-typed tool endpoints sourcing data from config
- `src/components/chat/*`: Chat UI, tool renderer, presets, input bar
- `src/components/landing/*`: Home page avatar, search, and CTAs
- `src/components/*`: Presentation, Skills, Projects carousel, Resume, Contact, Availability

---

**Deployment**
- Any platform that runs Next.js (Vercel recommended)
- Set environment variables in your hosting platform
- Ensure public assets and `portfolio-config.json` are included in the build

---

**Troubleshooting**
- Chat not responding: verify `GOOGLE_GENERATIVE_AI_API_KEY` and network access
- Build errors: validate `portfolio-config.json` is valid JSON and matches `src/types/portfolio.ts`
- Images not loading: confirm paths or allowlist host in `next.config.ts`
- SEO cards wrong: update image URLs in `layout.tsx`

---

**Credits**
- Built by and for Edison Xu. Uses the Vercel AI SDK and modern Next.js stack.


## 📚 Documentation

Full guides in [`docs/`](docs/):

- [Contributing](docs/CONTRIBUTING.md)
- [License](docs/LICENSE)
- [Setup](#-quick-start-5-minutes)
- [Troubleshooting](#-troubleshooting--support)

---

## 🤝 Contributing

We welcome your contributions!  
Check [open issues](https://github.com/anujjainbatu/portfolio/issues) or read [CONTRIBUTING.md](docs/CONTRIBUTING.md) to get started.

---

## 📄 License

MIT License — see [LICENSE](docs/LICENSE) for details.

---

<p align="center">
  <b>Made with ❤️ by developers, for developers</b><br>
  <a href="https://github.com/anujjainbatu/portfolio">⭐ Star on GitHub</a> | <a href="https://github.com/anujjainbatu/portfolio/issues">🐛 Report Bug</a> | <a href="https://github.com/anujjainbatu/portfolio/discussions">💬 Request Feature</a>
</p>
