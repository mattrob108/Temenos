# Temenos — Your Inner Universe

A premium spiritual self-discovery app featuring an interactive 3D sphere, AI companion, guided pathways, and deeply aesthetic cosmic UI.

## Quick start

1. Clone the repo:
   ```bash
   git clone https://github.com/mattrob108/Temenos.git
   cd Temenos
   ```

2. Set up config:
   ```bash
   cp public/js/config.example.js public/js/config.js
   ```

3. Fill in `public/js/config.js` with your Supabase URL and anon key.

4. Serve the site:
   ```bash
   npx serve public
   ```

5. Open `http://localhost:3000` to see the landing page, or `/app.html` for the main app.

> **Note**: This is currently a static site with no build step. Just open the HTML files directly or serve with any static server (e.g., `npx serve public`).

## Project structure

```
public/           Static HTML pages
  index.html      Marketing / landing page
  app.html        Main app (auth-gated)
  sphere.html     Sphere sandbox (no auth)
  js/
    config.js       Runtime keys (gitignored)
    config.example.js  Template for config.js
supabase/         Database migrations, edge functions
.env.example      Environment variable template (for future server-side use)
CLAUDE.md         AI session context
```

## Tech stack

- **Frontend**: Vanilla HTML / CSS / JS
- **Backend**: [Supabase](https://supabase.com) (auth, database, edge functions)
- **Auth**: Magic link (passwordless email)
- **Payments**: Stripe (planned)

## License

All rights reserved. This is proprietary software.
