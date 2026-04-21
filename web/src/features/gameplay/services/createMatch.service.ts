import { createMatch as createMatchFromApi } from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";

type CreateMatchInput = {
  gameId: string;
  sessionTimerSeconds?: number | null;
};

export async function createMatch({ gameId, sessionTimerSeconds }: CreateMatchInput): Promise<string> {
  return createMatchFromApi(supabase, { gameId, sessionTimerSeconds });
}
