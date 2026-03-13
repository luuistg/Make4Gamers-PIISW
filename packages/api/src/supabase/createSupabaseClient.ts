import { createClient } from "@supabase/supabase-js";

type SupabaseClientOptions = Parameters<typeof createClient>[2];

export function createSupabaseClient(
  supabaseUrl: string | undefined,
  supabaseAnonKey: string | undefined,
  options?: SupabaseClientOptions,
) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase URL or anon key");
  }

  return createClient(supabaseUrl, supabaseAnonKey, options);
}