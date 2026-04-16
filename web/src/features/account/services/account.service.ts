import {
  getAccountFriends as getAccountFriendsFromApi,
  getAccountProfile as getAccountProfileFromApi,
  getAccountRecentGames as getAccountRecentGamesFromApi,
  updateAccountProfile as updateAccountProfileFromApi,
  type AccountFriend,
  type AccountProfile,
  type AccountRecentGame,
} from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";

export type { AccountProfile, AccountRecentGame, AccountFriend };

export function getAccountProfile(userId: string): Promise<AccountProfile> {
  return getAccountProfileFromApi(supabase, userId);
}

export function updateAccountProfile(
  userId: string,
  patch: Partial<Omit<AccountProfile, "id">>,
): Promise<void> {
  return updateAccountProfileFromApi(supabase, userId, patch);
}

export function getAccountRecentGames(userId: string, limit = 5): Promise<AccountRecentGame[]> {
  return getAccountRecentGamesFromApi(supabase, userId, limit);
}

export function getAccountFriends(userId: string): Promise<AccountFriend[]> {
  return getAccountFriendsFromApi(supabase, userId);
}

export async function getAccountHighScores(userId: string) {
  const { data, error } = await supabase
    .from('scores')
    .select(`id, score, game:games(title)`)
    .eq('user_id', userId)
    .order('score', { ascending: false });

  if (error || !data) {
    console.error("Error obteniendo récords:", error);
    return [];
  }

  const bestScores: any[] = [];
  const seenGames = new Set();

  data.forEach((item: any) => {
    const gameData = item.game;
    const gameTitle = (Array.isArray(gameData) ? gameData[0]?.title : gameData?.title) || 'Desconocido';

    if (!seenGames.has(gameTitle)) {
      seenGames.add(gameTitle);
      bestScores.push({ ...item, displayTitle: gameTitle });
    }
  });

  return bestScores.slice(0, 3);
}
