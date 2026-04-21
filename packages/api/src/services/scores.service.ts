import type { SupabaseClient } from "@supabase/supabase-js";
import { findTopUserGameScore } from "../repositories/scores.repository";

export function getUserGameScore(client: SupabaseClient, userId: string, gameId: string) {
  return findTopUserGameScore(client, userId, gameId);
}