// Temenos v2 runtime config.
// Copy this file to `config.js` and fill in the values. `config.js` is gitignored.
window.TEMENOS_V2_CONFIG = {
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_KEY: 'your-anon-key',
  // Optional: external API keys. Leave blank to use built-in fallback data.
  ASTRO_API_KEY: '',
  // Where the magic link should send the user back to:
  AUTH_REDIRECT: window.location.origin + '/v2/app.html',
};
