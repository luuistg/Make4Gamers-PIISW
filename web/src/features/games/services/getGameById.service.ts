import { getGameById as getGameByIdFromApi, type Game } from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";

export type { Game };

export async function getGameById(id: string): Promise<Game> {
  return getGameByIdFromApi(supabase, id);
}