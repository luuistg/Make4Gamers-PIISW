import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchAllSettings(client: SupabaseClient) {
  const { data, error } = await client
    .from("scoring_settings")
    .select("*")
    .order("setting_key");
    
  if (error) throw error;
  return data;
}

export async function updateSettingValue(client: SupabaseClient, key: string, value: number) {
  const { error } = await client
    .from("scoring_settings")
    .update({ 
      setting_value: value, 
      updated_at: new Date().toISOString() 
    })
    .eq("setting_key", key);
    
  if (error) throw error;
}