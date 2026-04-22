import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../supabase";

export type MatchMovement = {
  id: string;
  match_id: string;
  player_id: string;
  move_data: Record<string, unknown>;
  server_timestamp: string;
};

async function fetchMovements(matchId: string): Promise<MatchMovement[]> {
  const { data, error, count } = await supabase
    .from("match_movements")
    .select("id, match_id, player_id, move_data, server_timestamp", { count: "exact" })
    .eq("match_id", matchId)
    .order("server_timestamp", { ascending: true });

  if (error) {
    console.error("[useMatchMovements] ❌ Error fetch:", error.message, error.code);
    return [];
  }

  console.log(`[useMatchMovements] fetch matchId=${matchId} → ${count} filas`, data);
  return (data as MatchMovement[]) ?? [];
}

const POLL_MS = 3000;

export function useMatchMovements(matchId: string | null, userId?: string | null) {
  const [movements, setMovements] = useState<MatchMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const realtimeOkRef = useRef(false);

  useEffect(() => {
    if (!matchId) {
      setMovements([]);
      return;
    }

    let isMounted = true;
    realtimeOkRef.current = false;

    console.log("[useMatchMovements] iniciando — matchId:", matchId, "userId:", userId);
    setLoading(true);

    // Carga inicial
    fetchMovements(matchId).then((data) => {
      if (isMounted) {
        setMovements(data);
        setLoading(false);
      }
    });

    // Realtime
    const channel = supabase
      .channel(`match-movements-${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "match_movements" },
        (payload) => {
          const row = payload.new as MatchMovement;
          if (row.match_id !== matchId) return;

          console.log("[useMatchMovements] ✅ evento realtime:", row);
          realtimeOkRef.current = true;

          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }

          if (isMounted) {
            setMovements((prev) =>
              prev.some((m) => m.id === row.id) ? prev : [...prev, row],
            );
          }
        },
      )
      .subscribe((status, err) => {
        console.log("[useMatchMovements] estado canal:", status, err ?? "");

        if (status === "SUBSCRIBED") {
          // Si tras 4s no llegó ningún evento realtime, activamos polling
          setTimeout(() => {
            if (!realtimeOkRef.current && isMounted) {
              console.warn("[useMatchMovements] ⚠️ Sin eventos realtime — activando polling cada", POLL_MS / 1000, "s");
              startPolling();
            }
          }, 4000);
        }

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("[useMatchMovements] canal con error — activando polling");
          startPolling();
        }
      });

    const startPolling = () => {
      if (pollRef.current) return;
      pollRef.current = setInterval(async () => {
        if (!isMounted) return;
        console.log("[useMatchMovements] polling tick — matchId:", matchId);
        const data = await fetchMovements(matchId);
        if (isMounted) {
          setMovements((prev) => {
            if (data.length === prev.length) return prev;
            console.log("[useMatchMovements] polling actualizando:", data.length, "movimientos");
            return data;
          });
        }
      }, POLL_MS);
    };

    return () => {
      isMounted = false;
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      void supabase.removeChannel(channel);
    };
  }, [matchId]);

  return { movements, loading };
}
