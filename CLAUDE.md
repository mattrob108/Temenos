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
supabase/
  config.toml   — Supabase project config (project ref, ports, auth settings)
  migrations/   — SQL migrations applied in order (schema, RLS, etc.)
  functions/    — Supabase Edge Functions (server-side logic)
  seed/         — Seed data for local development
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
- **Auth**: Magic link (email OTP) via `signInWithOtp`
- **Database schema**:

### `profiles` table
| Column            | Type        | Notes                                      |
|-------------------|-------------|--------------------------------------------|
| id                | uuid (PK)   | References auth.users(id), cascade delete  |
| name              | text        | Full name, collected at onboarding         |
| email             | text        | From auth, stored for convenience          |
| birthdate         | date        | Collected at onboarding                    |
| birth_location    | text        | Place of birth                             |
| birth_time        | time        | Optional, nullable                         |
| plan              | text        | 'free' by default, for future tiers        |
| systems_unlocked  | jsonb       | Array of unlocked system IDs, default '[]' |
| created_at        | timestamptz | Auto-set on insert                         |
| updated_at        | timestamptz | Auto-updated via trigger                   |

### RLS policies (Row Level Security)
- Users can SELECT, INSERT, UPDATE only their own row (where `auth.uid() = id`)
- No DELETE policy (admin-only operation)
- All access requires authentication (anon key + valid JWT)

## Coding conventions
- Vanilla JS (no frameworks, no build step currently)
- CSS custom properties for theming
- Single-file HTML pages (CSS + JS inline) — will modularize later
- Minimal dependencies — CDN-loaded Supabase client only
- Use IIFE patterns to avoid global scope pollution
- Prioritize smooth animations and visual polish

## Configuration
- `public/js/config.js` holds runtime keys (SUPABASE_URL, SUPABASE_KEY) — gitignored
- `public/js/config.example.js` is the committed template
- app.html loads config.js via `<script>` and reads `window.TEMENOS_CONFIG`

## Important notes
- The owner is a beginner developer — explain decisions clearly
- sphere.html is a standalone sandbox copy of app.html with auth removed

## v2 platform (mandala)

A second-generation platform lives in `public/v2/`. It is an opinionated rewrite
around a 9-fold **mandala** of self-knowledge systems (Western Astrology, Vedic
Astrology, Human Design, Gene Keys + 5 Pro-tier petals: Enneagram, MBTI, Spirit
Animal, Numerology, Blood Type).

### v2 tech choices
- **Single-file React artifact** (`public/v2/app.html`) — React + ReactDOM + Babel
  Standalone loaded via CDN, Tailwind CSS via CDN. No build step.
- **Supabase** for auth (magic link) and storage (`users_v2`, `user_systems`,
  `user_custom_systems` tables). Schema in `supabase/migrations/20260517000000_v2_*.sql`.
- **Audit-first data model**: every system row carries `source_api`,
  `fetched_date`, `fallback_active`, `fallback_source`, `is_stale`. Wire real
  APIs (astro-api.io etc.) by replacing `fetchSystemData()` in `app.html`.
- **Demo mode**: if `v2/js/config.js` is absent, the app falls back to local-
  state demo using `v2/data/systems.js`.

### Key v2 components
- `CosmicBackdrop` — Canvas starfield + drifting nebulae
- `Mandala` — 9-fold SVG geometry with core/locked petals
- `MagicLinkScreen` → `BirthInfoForm` → `ProfileView` → `SystemDetail` / `ExternalSystemModal` / `SettingsPanel` / `PaywallModal`
- All state via React hooks; no router (single SPA, modal-driven detail views).
