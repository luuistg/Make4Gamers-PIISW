import type { SupabaseClient } from "@supabase/supabase-js";

export function insertRankingScoreEvent(
  client: SupabaseClient,
  input: {
    userId: string;
    points: number;
    milestoneName: string;
    createdAt: string;
  },
) {
  return client.from("puntuaciones").insert([
    {
      user_id: input.userId,
      cantidad: input.points,
      hito: input.milestoneName,
      creado_en: input.createdAt,
    },
  ]);
}