import type { SupabaseClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "../repositories/auth.repository";
import { findActiveMatch, insertMatch } from "../repositories/matches.repository";
export type { ActiveMatch } from "../repositories/matches.repository";

type CreateMatchInput = {
  gameId: string;
  sessionTimerSeconds?: number | null;
};

export async function createMatch(
  client: SupabaseClient,
  { gameId, sessionTimerSeconds }: CreateMatchInput,
): Promise<string> {
  const userId = await getCurrentUserId(client);
  if (!userId) throw new Error("Usuario no autenticado");

  return insertMatch(client, { gameId, userId, sessionTimerSeconds: sessionTimerSeconds ?? null });
}

export async function getActiveMatch(
  client: SupabaseClient,
  gameId: string,
) {
  const userId = await getCurrentUserId(client);
  if (!userId) return null;
  return findActiveMatch(client, gameId, userId);
}
