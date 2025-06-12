import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// You should set these environment variables in your deployment platform
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseKey);
} 