import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../supabase";

export type MatchPlayer = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};

export type ActiveMatchData = {
  id: string;
  player_1: string;
  player_2: string | null;
  players: MatchPlayer[];
};

type RawMatch = {
  id: string;
  player_1: string;
  player_2: string | null;
  status: string;
  game_id: string;
};

async function loadMatchWithPlayers(matchRow: RawMatch): Promise<ActiveMatchData> {
  const playerIds = [matchRow.player_1, matchRow.player_2].filter(Boolean) as string[];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .in("id", playerIds);

  const players: MatchPlayer[] = playerIds.map((pid) => {
    const profile = profiles?.find((p) => p.id === pid);
    return {
      id: pid,
      username: profile?.username ?? null,
      avatar_url: profile?.avatar_url ?? null,
    };
  });

  return {
    id: matchRow.id,
    player_1: matchRow.player_1,
    player_2: matchRow.player_2 ?? null,
    players,
  };
}

async function fetchActiveMatch(
  gameId: string,
  userId: string,
): Promise<ActiveMatchData | null> {
  const { data: match, error } = await supabase
    .from("matches")
    .select("id, game_id, player_1, player_2, status")
    .eq("game_id", gameId)
    .eq("status", "in_progress")
    .or(`player_1.eq.${userId},player_2.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[useActiveMatch] Error buscando partida:", error.message);
    return null;
  }

  if (match) return loadMatchWithPlayers(match as RawMatch);

  // Fallback: la partida fue creada por el juego con su propio game_id
  const { data: fallbackMatch, error: fallbackError } = await supabase
    .from("matches")
    .select("id, game_id, player_1, player_2, status")
    .eq("status", "in_progress")
    .or(`player_1.eq.${userId},player_2.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fallbackError) {
    console.error("[useActiveMatch] Error en fallback:", fallbackError.message);
    return null;
  }

  if (!fallbackMatch) return null;
  return loadMatchWithPlayers(fallbackMatch as RawMatch);
}

export function useActiveMatch(
  gameId: string | null,
  userId: string | null,
) {
  const [match, setMatch] = useState<ActiveMatchData | null>(null);
  const [loading, setLoading] = useState(false);
  const gameIdRef = useRef(gameId);
  const userIdRef = useRef(userId);
  gameIdRef.current = gameId;
  userIdRef.current = userId;

  useEffect(() => {
    if (!gameId || !userId) return;

    let isMounted = true;
    setLoading(true);

    fetchActiveMatch(gameId, userId)
      .then((data) => {
        if (isMounted) setMatch(data);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    const channel = supabase
      .channel(`active-match-${gameId}-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        (payload) => {
          const row = (payload.new ?? payload.old) as RawMatch | null;
          if (!row) return;

          const currentGameId = gameIdRef.current;
          const currentUserId = userIdRef.current;

          if (row.game_id !== currentGameId) return;
          if (row.player_1 !== currentUserId && row.player_2 !== currentUserId) return;

          if (row.status === "in_progress") {
            loadMatchWithPlayers(row)
              .then((data) => { if (isMounted) setMatch(data); })
              .catch(console.error);
          } else {
            if (isMounted) setMatch(null);
          }
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      void supabase.removeChannel(channel);
    };
  }, [gameId, userId]);

  return { match, loading };
}
