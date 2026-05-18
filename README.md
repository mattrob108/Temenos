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
public/                     Static HTML pages
  index.html                v1 Marketing / landing page
  app.html                  v1 Main app (auth-gated, sphere)
  sphere.html               v1 Sphere sandbox (no auth)
  js/
    config.js               v1 runtime keys (gitignored)
    config.example.js       v1 config template
  v2/                       v2 Mandala platform
    index.html              v2 landing page
    app.html                v2 React single-file app (mandala, signup, profile, settings, paywall)
    js/config.example.js    v2 config template (copy to v2/js/config.js)
    data/systems.js         v2 fallback data + system catalogue
supabase/                   Database migrations, edge functions
.env.example                Environment variable template (for future server-side use)
CLAUDE.md                   AI session context
```

## v2 Quick start

```bash
cp public/v2/js/config.example.js public/v2/js/config.js   # fill in Supabase keys
npx serve public
# open http://localhost:3000/v2/         for landing
# open http://localhost:3000/v2/app.html for the mandala app
```

Without `config.js`, v2 runs in **demo mode** with mock data — no auth required, no persistence.

## Tech stack

- **Frontend**: Vanilla HTML / CSS / JS
- **Backend**: [Supabase](https://supabase.com) (auth, database, edge functions)
- **Auth**: Magic link (passwordless email)
- **Payments**: Stripe (planned)

## License

All rights reserved. This is proprietary software.
