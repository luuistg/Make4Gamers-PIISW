import type { SupabaseClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "../repositories/auth.repository";
import { insertMatch } from "../repositories/matches.repository";

type CreateMatchInput = {
  gameId: string;
};

export async function createMatch(client: SupabaseClient, { gameId }: CreateMatchInput): Promise<string> {
  const userId = await getCurrentUserId(client);
  if (!userId) throw new Error("Usuario no autenticado");

  return insertMatch(client, { gameId, userId });
}