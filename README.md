# Temenos — Your Inner Universe

A premium spiritual self-discovery app featuring an interactive 3D sphere, AI companion, guided pathways, and deeply aesthetic cosmic UI.

## Quick start

1. Clone the repo:
   ```bash
   git clone https://github.com/mattrob108/Temenos.git
   cd Temenos
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Fill in your `.env` with real keys (Supabase, Stripe, etc.)

4. Open `public/index.html` in a browser to see the landing page, or `public/app.html` for the main app.

> **Note**: This is currently a static site with no build step. Just open the HTML files directly or serve with any static server (e.g., `npx serve public`).

## Project structure

```
public/           Static HTML pages
  index.html      Marketing / landing page
  app.html        Main app (auth-gated)
  sphere.html     Sphere sandbox (no auth)
supabase/         (coming soon) Migrations, edge functions
.env.example      Environment variable template
CLAUDE.md         AI session context
```

## Tech stack

- **Frontend**: Vanilla HTML / CSS / JS
- **Backend**: [Supabase](https://supabase.com) (auth, database, edge functions)
- **Auth**: Magic link (passwordless email)
- **Payments**: Stripe (planned)

## License

All rights reserved. This is proprietary software.
