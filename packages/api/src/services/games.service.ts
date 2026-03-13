import type { SupabaseClient } from "@supabase/supabase-js";
import { findAllGames, findGameById } from "../repositories/games.repository";

export function getGames(client: SupabaseClient) {
  return findAllGames(client);
}

export function getGameById(client: SupabaseClient, id: string) {
  return findGameById(client, id);
}