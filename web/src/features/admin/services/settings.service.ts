import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchAllSettings, updateSettingValue } from "../repositories/settings.repository";

export async function getScoringSettings(client: SupabaseClient) {
  try {
    const settings = await fetchAllSettings(client);
    return { success: true, data: settings };
  } catch (error: any) {
    console.error("Error obteniendo configuraciones:", error);
    return { success: false, error: error.message };
  }
}

export async function updateScoringSetting(client: SupabaseClient, key: string, value: number) {
  try {
    await updateSettingValue(client, key, value);
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error actualizando configuración:", error);
    return { success: false, error: error.message };
  }
}