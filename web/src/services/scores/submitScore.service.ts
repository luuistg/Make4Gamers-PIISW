import { supabase } from "../../supabase";

const isUuid = (value: string | null | undefined): value is string =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export type ScoreRecord = {
  id: string;
  user_id: string;
  game_id: string;
  match_id?: string;
  score: number;
  created_at: string;
};

export async function submitUserGameScore(
  userId: string,
  gameId: string,
  score: number,
  matchId?: string,
): Promise<ScoreRecord> {
  if (!isUuid(userId)) {
    throw new Error(`submitUserGameScore: userId inválido ${userId}`);
  }
  if (!isUuid(gameId)) {
    throw new Error(`submitUserGameScore: gameId inválido ${gameId}`);
  }
  const safeMatchId = matchId && isUuid(matchId) ? matchId : undefined;

  if (matchId && !isUuid(matchId)) {
    throw new Error("Match ID inválido, no se puede guardar la puntuación");
  }

  const { data, error } = await supabase
    .from("scores")
    .insert({
      user_id: userId,
      game_id: gameId,
      score,
      match_id: safeMatchId,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "No se pudo guardar la puntuación");
  }

  return data as ScoreRecord;
}
