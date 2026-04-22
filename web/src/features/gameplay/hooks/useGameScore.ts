import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { getUserGameScore } from "../services/getUserGameScore.service";

export function useGameScore(userId: string | null, gameId: string | null) {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !gameId) return;

    let isMounted = true;

    const loadScore = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const s = await getUserGameScore(userId, gameId);
        if (isMounted) setScore(s);
      } catch (err) {
        console.error("[useGameScore] Error cargando score:", err);
        if (isMounted) setScore(null);
      } finally {
        if (isMounted && showLoading) setLoading(false);
      }
    };

    loadScore();

    // Sin filtro server-side: Supabase requiere REPLICA IDENTITY FULL para
    // que los filtros en postgres_changes funcionen. Filtramos en el callback.
    const channel = supabase
      .channel(`game-score-${userId}-${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "scores",
        },
        (payload) => {
          const row = (payload.new ?? payload.old) as {
            user_id?: string;
            game_id?: string;
            score?: number;
          } | null;

          console.log("[useGameScore] evento recibido:", payload.eventType, row);

          // Filtrar en el cliente
          if (row?.user_id !== userId || row?.game_id !== gameId) return;

          const newScore = (payload.new as { score?: number } | null)?.score;
          if (typeof newScore === "number") {
            console.log("[useGameScore] actualizando score a:", newScore);
            if (isMounted) setScore(newScore);
          } else {
            void loadScore(false);
          }
        },
      )
      .subscribe((status, err) => {
        console.log("[useGameScore] estado canal:", status, err ?? "");
      });

    return () => {
      isMounted = false;
      void supabase.removeChannel(channel);
    };
  }, [userId, gameId]);

  return { score, loading };
}
