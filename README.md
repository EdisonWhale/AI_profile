# 🚀 Edison Xu - AI-Powered Portfolio

**A modern, interactive developer portfolio built with Next.js 15, TypeScript, and AI-powered chat functionality.**  
Showcase your skills, projects, and experience with an intelligent chatbot that knows everything about you.

![Portfolio Preview](https://raw.githubusercontent.com/anujjainbatu/ai-portfolio-system-landing-page/refs/heads/main/assets/portfolio.png)

<p align="center">
  <a href="https://www.edisonwhale.com/"><img src="https://img.shields.io/badge/Demo-Live%20Site-brightgreen" alt="Live Demo"></a>
  <a href="docs/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-100%25-blue" alt="TypeScript"></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15.2.3-black" alt="Next.js"></a>
  <a href="https://github.com/edisonwhale/portfolio/issues"><img src="https://img.shields.io/github/issues/edisonwhale/portfolio" alt="GitHub Issues"></a>
</p>

---

## ✨ Features

### 🤖 AI-Powered Chat Interface
- **Intelligent Conversations**: Powered by Google Gemini 2.5 Flash Lite
- **Context-Aware Responses**: AI knows your entire background, projects, and skills
- **Tool Integration**: Dynamic tools for accessing resume, projects, contact info, and more
- **Preset Questions**: Quick access to common inquiries about your background
- **Mobile Optimized**: Responsive chat interface with smooth animations

### 🎨 Modern Design & UX
- **Apple-Inspired Design**: Clean, minimalist interface with smooth animations
- **Framer Motion**: Fluid page transitions and micro-interactions
- **Dark/Light Theme**: Built-in theme switching with next-themes
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Animated Avatar**: Interactive profile picture with glow effects

### 📱 Interactive Components
- **Landing Page**: Elegant introduction with search functionality
- **Project Showcase**: Detailed project cards with technologies and achievements
- **Skills Display**: Organized skill categories with visual indicators
- **Resume Download**: Direct PDF download functionality
- **Contact Information**: Easy access to professional details

### 🔧 Technical Excellence
- **Next.js 15**: Latest App Router with React 19
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first styling with custom design system
- **AI SDK**: Seamless integration with Google's AI services
- **Performance Optimized**: Fast loading with optimized images and code splitting

---

## 🚦 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm/npm/yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/edisonwhale/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Google Gemini API key:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

4. **Customize your portfolio**
   - Edit `portfolio-config.json` with your information
   - Replace images in `/public/` directory
   - Update resume PDF in `/public/`

5. **Run development server**
   ```bash
   pnpm dev
   ```
   
   Visit [http://localhost:3000](http://localhost:3000)

6. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

---

## 🗂️ Project Structure

```
portfolio/
├── portfolio-config.json     # Main configuration file
├── public/                  # Static assets
│   ├── profile.jpeg         # Profile picture
│   ├── Edison-resume-2025.pdf # Resume PDF
│   └── favicon.ico          # Site favicon
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Landing page
│   │   ├── chat/            # Chat interface route
│   │   └── api/chat/        # AI chat API endpoints
│   ├── components/          # React components
│   │   ├── landing/         # Landing page components
│   │   ├── chat/            # Chat interface components
│   │   ├── projects/        # Project showcase components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utilities and config loaders
│   └── types/               # TypeScript type definitions
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

---

## ⚙️ Configuration

### Portfolio Configuration (`portfolio-config.json`)

The main configuration file contains all your personal information:

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title",
    "bio": "Your bio...",
    "avatar": "/profile.jpeg"
  },
  "experience": [
    {
      "company": "Company Name",
      "position": "Position",
      "duration": "Duration",
      "description": "Description",
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description",
      "techStack": ["Tech1", "Tech2"],
      "featured": true
    }
  ],
  "skills": {
    "programming": ["Language1", "Language2"],
    "web_development": ["Framework1", "Framework2"],
    "databases": ["DB1", "DB2"]
  },
  "chatbot": {
    "name": "Your AI Name",
    "personality": "casual, enthusiastic, tech-savvy",
    "tone": "friendly and conversational"
  }
}
```

### Environment Variables

```env
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Optional
NEXT_PUBLIC_SITE_URL=https://your-site.com
```

---

## 🤖 AI Chat Features

### Intelligent Tools
The AI chatbot has access to specialized tools:

- **`getProjects`**: Retrieve detailed project information
- **`getResume`**: Access resume details and download link
- **`getContact`**: Get contact information and social links
- **`getSkills`**: List technical skills and expertise
- **`getEntryLevel`**: Check availability and career status
- **`getPresentation`**: Get personal introduction and background

### Preset Questions
Quick access to common inquiries:

- **Personal**: "Who are you?", "Tell me about yourself"
- **Professional**: "What are your skills?", "Can I see your resume?"
- **Projects**: "What projects are you most proud of?"
- **Contact**: "How can I reach you?", "Where are you located?"

### Customization
- Modify chatbot personality in `portfolio-config.json`
- Add custom preset questions
- Adjust response style and tone
- Configure available topics

---

## 🎨 Customization

### Styling
- **Tailwind CSS**: Custom design system with CSS variables
- **Apple Tech Theme**: Modern gradient backgrounds and animations
- **Component Variants**: Flexible UI components with multiple styles

### Adding New Sections
1. Update `portfolio-config.json` with new data
2. Create new components in `src/components/`
3. Add TypeScript types in `src/types/`
4. Integrate with chat tools if needed

### Images and Assets
- **Profile Picture**: `public/profile.jpeg` (400x400px+ recommended)
- **Project Images**: `public/project-*.jpg` (1200x800px recommended)
- **Resume**: `public/Edison-resume-2025.pdf`
- **Favicon**: `public/favicon.ico`

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Import from GitHub, set build command: `npm run build`
- **Railway**: Connect GitHub repo, set environment variables
- **Docker**: Use provided Dockerfile for containerized deployment

---

## 🛠️ Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Tech Stack
- **Framework**: Next.js 15.2.3 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini 2.5 Flash Lite via AI SDK
- **Animations**: Framer Motion
- **UI Components**: Radix UI primitives
- **State Management**: React hooks and context
- **Deployment**: Vercel-ready

---

## 🆘 Troubleshooting

### Common Issues

**AI Chat not working?**
- Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set correctly
- Check API quota and billing status
- Ensure network connectivity

**Build errors?**
- Run `pnpm lint` to check for TypeScript errors
- Validate `portfolio-config.json` syntax
- Check for missing dependencies

**Images not loading?**
- Verify file paths in `portfolio-config.json`
- Ensure images exist in `/public/` directory
- Check file permissions

### Getting Help
- [Open an Issue](https://github.com/edisonwhale/portfolio/issues)
- Check the [Discussions](https://github.com/edisonwhale/portfolio/discussions)
- Email: edisonapply@gmail.com

---

## 📄 License

MIT License - see [LICENSE](docs/LICENSE) for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<p align="center">
  <b>Built with ❤️ by Edison Xu</b><br>
  <a href="https://www.edisonwhale.com">🌐 Visit Portfolio</a> | 
  <a href="https://github.com/edisonwhale/portfolio">⭐ Star on GitHub</a> | 
  <a href="https://github.com/edisonwhale/portfolio/issues">🐛 Report Bug</a>
</p>
