import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import { getGameRanking, type RankingEntry } from "../services/scores/getGameRanking.service";
import { getUserAchievements, type UserAchievement } from "../services/achievements/achievements.service";
import { getGames, type Game } from "../services/games/getGames";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Ranking() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [myAchievements, setMyAchievements] = useState<UserAchievement[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState<"global" | "local">("global");
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const query = useQuery();
  const initialGameId = query.get("gameId");
  const gameId = selectedGameId || initialGameId;

  useEffect(() => {
    const loadGames = async () => {
      try {
        const allGames = await getGames();
        setGames(allGames);
      } catch (error) {
        console.error("Error cargando juegos:", error);
      }
    };

    loadGames();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!gameId) return;

      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id ?? null;
      const currentCountry = authData.user?.user_metadata?.country ?? null;

      setCurrentUserId(userId);

      try {
        const entries = await getGameRanking(
          gameId,
          0, // 0 means traer todos los jugadores
          scope === "local" ? currentCountry : undefined,
        );
        setRanking(entries);

        if (userId) {
          const achievements = await getUserAchievements(userId, gameId);
          setMyAchievements(achievements);
        }
      } catch (error) {
        console.error("Error cargando ranking/insignias:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [gameId, scope]);

  const selectedGame = useMemo(() => games.find((g) => g.id === gameId), [games, gameId]);
  const myHighScore = useMemo(() => {
    if (!currentUserId) return null;
    return ranking.find((item) => item.user_id === currentUserId)?.score ?? null;
  }, [currentUserId, ranking]);

  return (
    <section className="min-h-screen bg-slate-950 text-white p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Ranking</h1>
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Seleccionar juego"
            className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2"
            value={gameId ?? ""}
            onChange={(e) => setSelectedGameId(e.target.value || null)}
          >
            <option value="">-- Selecciona un juego --</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.title}
              </option>
            ))}
          </select>
          {gameId && selectedGame && (
            <span className="text-sm text-slate-300">Juego seleccionado: {selectedGame.title}</span>
          )}
        </div>
      </div>

      {!gameId && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-300">
            Selecciona un juego para ver el ranking global / local y tus insignias.
          </p>
        </div>
      )}

      {gameId && (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Ranking del Juego</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScope("global")}
                className={`px-4 py-2 rounded-lg ${scope === "global" ? "bg-indigo-600" : "bg-slate-800"}`}
              >
                Global
              </button>
              <button
                onClick={() => setScope("local")}
                className={`px-4 py-2 rounded-lg ${scope === "local" ? "bg-indigo-600" : "bg-slate-800"}`}
              >
                Local
              </button>
            </div>
          </div>
          {myHighScore !== null && (
            <div className="mb-4 rounded-lg border border-yellow-400 bg-yellow-950/20 p-3">
              <p className="text-sm text-yellow-200">Mi mejor puntuación en este juego: <strong className="text-yellow-400">{myHighScore}</strong></p>
            </div>
          )}
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <h2 className="text-xl font-semibold mb-3">Top del Ranking</h2>
                {ranking.length === 0 ? (
                  <p>No hay puntuaciones aún.</p>
                ) : (
                  <ol className="space-y-2">
                    {ranking.map((item) => (
                      <li
                        key={`${item.user_id}-${item.rank}`}
                        className={`flex items-center justify-between p-3 rounded-lg ${item.user_id === currentUserId ? "bg-yellow-700 text-yellow-100" : "bg-slate-800"}`}
                      >
                        <div>
                          <span className="font-semibold">#{item.rank}</span> {item.username}
                        </div>
                        <span className="font-bold">{item.score}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <h2 className="text-xl font-semibold mb-3">Mis Insignias</h2>
                {myAchievements.length === 0 ? (
                  <p>No tienes insignias todavía.</p>
                ) : (
                  <ul className="space-y-2">
                    {myAchievements.map((ach) => (
                      <li key={ach.id} className="rounded-lg border border-indigo-500 p-2 bg-slate-800">
                        <h3 className="font-semibold">{ach.achievement?.title ?? "Logro"}</h3>
                        <p className="text-sm text-slate-300">{ach.achievement?.description}</p>
                        <p className="text-xs text-slate-400">
                          Otorgado: {new Date(ach.awarded_at).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

