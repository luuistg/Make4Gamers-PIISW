import { getUserGameScore as getUserGameScoreFromApi } from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";

export async function getUserGameScore(userId: string, gameId: string): Promise<number | null> {
  return getUserGameScoreFromApi(supabase, userId, gameId);
}