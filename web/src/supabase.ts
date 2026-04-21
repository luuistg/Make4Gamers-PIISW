import { createSupabaseClient } from "../../packages/api/src/supabase/createSupabaseClient";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!rawSupabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const supabaseUrl = new URL(rawSupabaseUrl).origin;

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);