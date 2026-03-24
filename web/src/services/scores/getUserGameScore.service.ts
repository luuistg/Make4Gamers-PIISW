import { supabase } from "../../supabase";

const isUuid = (value: string | null | undefined): value is string =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export async function getUserGameScore(userId: string, gameId: string): Promise<number | null> {
  if (!isUuid(userId)) {
    console.warn("getUserGameScore: userId inválido", userId);
    return null;
  }
  if (!isUuid(gameId)) {
    console.warn("getUserGameScore: gameId inválido", gameId);
    return null;
  }

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