import { createSupabaseClient } from "../../packages/api/src/supabase/createSupabaseClient";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY",
  );
}

export const supabase = createSupabaseClient(
  supabaseUrl,
  supabasePublishableKey,
);
