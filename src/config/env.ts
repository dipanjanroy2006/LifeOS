// Environment Variable Validation
// Source of truth: Vite import.meta.env

export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const;

if (!ENV.SUPABASE_URL || !ENV.SUPABASE_URL.startsWith('http')) {
  throw new Error(
    "CRITICAL CONFIGURATION ERROR: VITE_SUPABASE_URL is missing or invalid. Please check your .env file."
  );
}

if (!ENV.SUPABASE_ANON_KEY || ENV.SUPABASE_ANON_KEY.length < 20) {
  throw new Error(
    "CRITICAL CONFIGURATION ERROR: VITE_SUPABASE_ANON_KEY is missing or invalid. Please check your .env file."
  );
}
