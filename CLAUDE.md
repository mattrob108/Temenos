# Temenos — Project Context

## What is Temenos?
Temenos is a premium, spiritual self-discovery web app. Users get a personal "sphere" — a living, interactive 3D orb that visualizes their inner journey. The app includes an AI chat companion, guided pathways, a shop for unlockable content, and deeply aesthetic dark-mode UI.

The name "Temenos" means "sacred space" in Greek — a protected inner world for reflection and growth.

## Target audience
Spiritually curious millennials/Gen-Z who value aesthetics, self-improvement, and personal meaning-making. Think: the intersection of astrology apps, journaling, and meditation tools — but elevated.

## Tech stack
- **Frontend**: Vanilla HTML/CSS/JS (single-file pages), no framework
- **Backend**: Supabase (auth, database, edge functions)
- **Auth**: Supabase magic link (email-based, passwordless)
- **Hosting**: TBD (likely Vercel or Netlify for static, Supabase for backend)
- **Payments**: Stripe (planned)
- **Fonts**: Syne (UI) + Cormorant Garamond (display/serif)

## Project structure
```
public/
  index.html    — Marketing landing page (unauthenticated)
  app.html      — Main app with auth gate, sphere, chat, pathways, shop
  sphere.html   — Standalone sphere sandbox (no auth, hardcoded profile)
.env.example    — Template for environment variables
.gitignore      — Git ignore rules
CLAUDE.md       — This file (project context for AI sessions)
README.md       — Project overview and setup instructions
package.json    — Project metadata and scripts
```

## Design system
- **Theme**: Dark, cosmic, luxurious. Think deep space meets high-end spa.
- **Colors**:
  - `--void: #04050a` (background)
  - `--gold: #c9a96e` (primary accent, CTAs)
  - `--teal: #4ecdc4` (secondary accent, active states)
  - `--violet: #9b72cf` (tertiary, spiritual/mystic)
  - `--ember: #e8705a` (warnings, errors, energy)
  - `--text: #e8e4dc` (body text)
  - `--muted: rgba(232,228,220,0.45)` (secondary text)
- **Effects**: Glassmorphism modals, custom cursor (gold dot + ring), starfield backgrounds, smooth transitions
- **Typography**: Syne for UI, Cormorant Garamond for display headings (letter-spaced, uppercase)

## Key features
1. **Sphere**: 3D interactive orb (canvas-based) that represents the user's inner world
2. **Chat companion**: AI-powered right panel for guided conversations
3. **Pathways**: Guided journey tracks (e.g., Shadow Work, Inner Child)
4. **Left panel**: System list showing active/locked spheres and data points
5. **Shop**: Unlock new pathways, sphere styles, and content
6. **Settings**: User preferences modal
7. **Onboarding**: Name, birthdate, birth time collection on first login

## Supabase details
- **Project ref**: isfdktgunaquujmvklcr
- **Database tables**: profiles (name, birthdate, birth_time, plan)
- **Auth**: Magic link (email OTP)

## Coding conventions
- Vanilla JS (no frameworks, no build step currently)
- CSS custom properties for theming
- Single-file HTML pages (CSS + JS inline) — will modularize later
- Minimal dependencies — CDN-loaded Supabase client only
- Use IIFE patterns to avoid global scope pollution
- Prioritize smooth animations and visual polish

## Important notes
- The owner is a beginner developer — explain decisions clearly
- sphere.html is a standalone sandbox copy of app.html with auth removed
- Supabase anon key is currently hardcoded in app.html (needs to move to env vars)
- The duplicate Supabase script tag in app.html (line 8-9) should be cleaned up
