/** Base URL of the NC LOG middleware (no trailing slash). */
export function getApiBaseUrl(): string {
  const v = import.meta.env.VITE_API_BASE_URL;
  if (import.meta.env.DEV && (!v || String(v).trim() === '')) {
    console.warn(
      '[nclog] VITE_API_BASE_URL is not set. Add it to .env.local (see .env.example).',
    );
  }
  return typeof v === 'string' ? v.replace(/\/$/, '') : '';
}

/** Supabase anon key — sent as `apikey` on POST /auth/login. */
export function getSupabaseAnonKey(): string {
  const v = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (import.meta.env.DEV && (!v || String(v).trim() === '')) {
    console.warn(
      '[nclog] VITE_SUPABASE_ANON_KEY is not set. Add it to .env.local (see .env.example).',
    );
  }
  return typeof v === 'string' ? v : '';
}
