import { supabase } from "../../supabase";

export type RankingEntry = {
  user_id: string;
  username: string | null;
  score: number;
  rank: number;
};

export async function getGameRanking(
  gameId: string,
  limit = 15,
  currentUserCountry?: string | null,
): Promise<RankingEntry[]> {
  // 1. Construimos la base de la consulta
  // Usamos 'inner' join (el !) en users si queremos filtrar obligatoriamente por país
  let query = supabase
    .from("scores")
    .select(`
      user_id, 
      score, 
      users!inner(username, country)
    `)
    .eq("game_id", gameId);

  // 2. Aplicamos filtro de país si existe
  if (currentUserCountry) {
    // Nota: 'users.country' funciona aquí porque usamos !inner arriba
    query = query.eq("users.country", currentUserCountry);
  }

  // 3. Orden y límite (limit <= 0 => sin límite / todos)
  let queryOrdered = query.order("score", { ascending: false });

  if (limit > 0) {
    queryOrdered = queryOrdered.limit(limit);
  }

  const response = await queryOrdered;
  if (response.error) {
    // Fallback: tal vez no exista la relación users, intentamos con profile o solo scores
    if (response.error.message?.includes("No query specified") || response.error.message?.includes("invalid column reference")) {
      // ignore
    } else if (response.error.message?.includes("Could not find table")) {
      console.warn("No existe la tabla scores/relations, no se puede recuperar ranking: ", response.error.message);
      return [];
    }
  }

  if (!response.data || response.error) {
    // Intentemos fallback sin relación a usuarios
    const fallbackQuery = supabase
      .from("scores")
      .select(`user_id, score`)
      .eq("game_id", gameId)
      .order("score", { ascending: false });

    if (limit > 0) {
      fallbackQuery.limit(limit);
    }

    const fallbackResult = await fallbackQuery;
    if (fallbackResult.error) {
      console.error("Error fetching ranking fallback:", fallbackResult.error);
      return [];
    }

    const fallbackData = fallbackResult.data as Array<{ user_id: string; score: number }>;
    const compact = fallbackData.reduce<Record<string, RankingEntry>>((acc, row) => {
      const existing = acc[row.user_id];
      if (!existing || row.score > existing.score) {
        acc[row.user_id] = {
          user_id: row.user_id,
          username: row.user_id,
          score: row.score,
          rank: 0,
        };
      }
      return acc;
    }, {});

    const sorted = Object.values(compact).sort((a, b) => b.score - a.score);
    return sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
  }

  const raw = response.data as Array<{ user_id: string; score: number; users?: { username: string; country: string }[] }>;

  const bestByUser = raw.reduce<Record<string, RankingEntry>>((acc, row) => {
    const username = row.users?.[0]?.username ?? row.user_id;
    const existing = acc[row.user_id];

    if (!existing || row.score > existing.score) {
      acc[row.user_id] = {
        user_id: row.user_id,
        username,
        score: row.score,
        rank: 0,
      };
    }

    return acc;
  }, {});

  const sorted = Object.values(bestByUser).sort((a, b) => b.score - a.score);

  return sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}