import type { SupabaseClient } from "@supabase/supabase-js";

export async function insertMatch(
  client: SupabaseClient,
  input: { gameId: string; userId: string },
): Promise<string> {
  const { data, error } = await client
    .from("matches")
    .insert({
      game_id: input.gameId,
      player_1: input.userId,
      status: "in_progress",
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    throw new Error(error?.message || "No se pudo crear la partida");
  }

  return data.id;
}