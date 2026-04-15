import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserGameplayStat } from "../types/gameplay-stat";

const USER_GAMEPLAY_STAT_SELECT_FIELDS = `
  id,
  user_id,
  game_key,
  game_title,
  played_seconds,
  last_played_at,
  created_at
`;

export async function findUserGameplayStat(
  client: SupabaseClient,
  input: { userId: string; gameKey: string },
): Promise<UserGameplayStat | null> {
  const { data, error } = await client
    .from("user_gameplay_stats")
    .select(USER_GAMEPLAY_STAT_SELECT_FIELDS)
    .eq("user_id", input.userId)
    .eq("game_key", input.gameKey)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "No se pudo recuperar el tiempo de juego");
  }

  return (data as UserGameplayStat | null) ?? null;
}

export async function insertUserGameplayStat(
  client: SupabaseClient,
  input: {
    userId: string;
    gameKey: string;
    gameTitle?: string;
    playedSeconds: number;
    lastPlayedAt: string;
  },
): Promise<UserGameplayStat> {
  const { data, error } = await client
    .from("user_gameplay_stats")
    .insert({
      user_id: input.userId,
      game_key: input.gameKey,
      game_title: input.gameTitle ?? null,
      played_seconds: input.playedSeconds,
      last_played_at: input.lastPlayedAt,
    })
    .select(USER_GAMEPLAY_STAT_SELECT_FIELDS)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "No se pudo crear el registro de tiempo de juego");
  }

  return data as UserGameplayStat;
}

export async function updateUserGameplayStat(
  client: SupabaseClient,
  input: {
    id: string;
    playedSeconds: number;
    lastPlayedAt: string;
    gameTitle?: string;
  },
): Promise<UserGameplayStat> {
  const payload: {
    played_seconds: number;
    last_played_at: string;
    game_title?: string;
  } = {
    played_seconds: input.playedSeconds,
    last_played_at: input.lastPlayedAt,
  };

  if (input.gameTitle) {
    payload.game_title = input.gameTitle;
  }

  const { data, error } = await client
    .from("user_gameplay_stats")
    .update(payload)
    .eq("id", input.id)
    .select(USER_GAMEPLAY_STAT_SELECT_FIELDS)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "No se pudo actualizar el tiempo de juego");
  }

  return data as UserGameplayStat;
}
