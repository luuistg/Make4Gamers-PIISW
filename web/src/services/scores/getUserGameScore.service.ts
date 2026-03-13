import { supabase } from "../../supabase";

export async function getUserGameScore(userId: string, gameId: string): Promise<number | null> {
  const { data, error } = await supabase
    .from("scores")
    .select("score")
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .order("score", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message || "No se pudo recuperar el score");
  }

  if (!data || data.length === 0) return null;
  return data[0].score as number;
}