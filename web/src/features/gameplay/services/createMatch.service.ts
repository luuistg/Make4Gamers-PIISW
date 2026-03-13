import { createMatch as createMatchFromApi } from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";

type CreateMatchInput = {
  gameId: string;
};

export async function createMatch({ gameId }: CreateMatchInput): Promise<string> {
  return createMatchFromApi(supabase, { gameId });
}