import { createClient } from '@supabase/supabase-js';

// Fallback configuration if environment variables are not yet populated
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-lifeos.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
