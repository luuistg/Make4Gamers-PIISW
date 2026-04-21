import type { SupabaseClient } from "@supabase/supabase-js";
import {
  findAcceptedFriendsByUser,
  findAccountProfile,
  findRecentGamesByUser,
  patchAccountProfile,
} from "../repositories/account.repository";
import type { AccountFriend, AccountProfile, AccountRecentGame } from "../types/account";

type RawFriend = {
  id: string;
  user_a: string;
  user_b: string;
  profile_a: { username?: string | null; avatar_url?: string | null; status?: string | null } | null;
  profile_b: { username?: string | null; avatar_url?: string | null; status?: string | null } | null;
};

export function getAccountProfile(client: SupabaseClient, userId: string): Promise<AccountProfile> {
  return findAccountProfile(client, userId);
}

export function updateAccountProfile(
  client: SupabaseClient,
  userId: string,
  patch: Partial<Omit<AccountProfile, "id">>,
): Promise<void> {
  return patchAccountProfile(client, userId, patch);
}

export async function getAccountRecentGames(
  client: SupabaseClient,
  userId: string,
  limit = 5,
): Promise<AccountRecentGame[]> {
  const rows = await findRecentGamesByUser(client, userId, limit);

  return rows.map((row) => {
    const gameValue = Array.isArray(row.game) ? row.game[0] : row.game;

    return {
      id: row.id,
      score: row.score,
      created_at: row.created_at,
      game: gameValue ? { title: gameValue.title ?? null } : null,
    };
  });
}

export async function getAccountFriends(client: SupabaseClient, userId: string): Promise<AccountFriend[]> {
  const rows = (await findAcceptedFriendsByUser(client, userId)) as RawFriend[];

  return rows.map((row) => {
    const isUserA = row.user_a === userId;
    const friendUserId = isUserA ? row.user_b : row.user_a;
    const profile = isUserA ? row.profile_b : row.profile_a;

    return {
      id: friendUserId,
      username: profile?.username || "Unknown",
      avatar_url: profile?.avatar_url || null,
      status: profile?.status || "Desconectado",
    };
  });
}
