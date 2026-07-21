import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wcchjuhhcfolzuxxljta.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjY2hqdWhoY2ZvbHp1eHhsanRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NDc1OTMsImV4cCI6MjEwMDIyMzU5M30.G32sJYYP4MTLPQaVlbgU9j7aXRuUtGCt6WQNxpQbTaM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
