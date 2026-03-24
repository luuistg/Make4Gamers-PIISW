import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getGameById, type Game } from "../services/games/getGameById.service";
import { createMatch } from "../services/matches/createMatch.service";
import { getUserGameScore } from "../services/scores/getUserGameScore.service";
import { submitUserGameScore } from "../services/scores/submitScore.service";
import {
  checkAndAwardAchievements,
  createGameAchievement,
  getGameAchievements,
  type Achievement,
} from "../services/achievements/achievements.service";

import { supabase } from "../supabase";
import GameViewport from "../components/gameplay/GameViewport";
import GameplaySidebar from "../components/gameplay/GameplaySidebar";

export default function Gameplay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);

  const [myScore, setMyScore] = useState<number | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achLoading, setAchLoading] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [newAchievement, setNewAchievement] = useState<{ title: string; description: string; criteriaType: "score_min" | "rank_top" | "manual"; criteriaValue: number }>({
    title: "",
    description: "",
    criteriaType: "score_min",
    criteriaValue: 1000,
  });

  const [isGameOwner, setIsGameOwner] = useState(false);

  useEffect(() => {
    if (game && user) {
      setIsGameOwner(game.developer_id === user.id);
    }
  }, [game, user]);

  useEffect(() => {
    const loadGame = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getGameById(id);
        setGame(data);
        setIsGameOver(false);
      } catch (error) {
        console.error("Error loading game:", error);
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const initMatch = async () => {
      if (!game?.id || !user?.id || matchId) return;

      try {
        const newMatchId = await createMatch({ gameId: game.id });
        setMatchId(newMatchId);
      } catch (error) {
        console.error("Error creando match:", error);
      }
    };

    initMatch();
  }, [game?.id, user?.id, matchId]);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!game?.id) return;
      setAchLoading(true);

      try {
        const list = await getGameAchievements(game.id);
        setAchievements(list);
      } catch (error) {
        console.error("Error cargando logros:", error);
      } finally {
        setAchLoading(false);
      }
    };

    loadAchievements();
  }, [game?.id]);

  const isUuid = (value: string | null | undefined): value is string =>
    typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  const finalGameUrl = useMemo(() => {
    if (!game?.game_url) return "";

    const playerName = user && isUuid(user.id) ? user.id : "anonimo";
    const currentMatchId = matchId && isUuid(matchId) ? matchId : "";
    const currentGameId = isUuid(game.id) ? game.id : id || "";

    const url = new URL(game.game_url);
    url.searchParams.set("player", playerName);
    url.searchParams.set("matchId", currentMatchId);
    url.searchParams.set("gameId", currentGameId);

    return url.toString();
  }, [game, id, user, matchId]);

  const handleCreateAchievement = async () => {
    if (!game?.id || !user?.id || !isGameOwner) return;

    setAchLoading(true);

    try {
      await createGameAchievement({
        gameId: game.id,
        title: newAchievement.title.trim(),
        description: newAchievement.description.trim(),
        criteriaType: newAchievement.criteriaType as "score_min" | "rank_top" | "manual",
        criteriaValue: Number(newAchievement.criteriaValue),
      });

      setNewAchievement({
        title: "",
        description: "",
        criteriaType: "score_min",
        criteriaValue: 1000,
      });

      const list = await getGameAchievements(game.id);
      setAchievements(list);
    } catch (error) {
      console.error("Error creando logro:", error);
    } finally {
      setAchLoading(false);
    }
  };

  const submitAndCheckScore = useCallback(
    async (score: number, sourceMatchId?: string) => {
      if (!user?.id || !game?.id) return;

      const idToUse = sourceMatchId || matchId;

      try {
        await submitUserGameScore(user.id, game.id, score, idToUse ?? undefined);
        setMyScore((prev) => {
          const maxScore = prev === null ? score : Math.max(prev, score);
          return maxScore;
        });
        await checkAndAwardAchievements(user.id, game.id, score);
      } catch (error) {
        console.error("Error guardando score automático:", error);
      }
    },
    [user?.id, game?.id, matchId],
  );

  useEffect(() => {
    const handleGameMessage = async (event: MessageEvent) => {
      if (!game?.id || !user?.id) return;
      if (!event.data) return;

      let data = event.data as unknown;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          // no es JSON, dejamos el valor como está
        }
      }

      const parsedData = (data as Record<string, unknown>) ?? {};
      const eventType = ((parsedData?.type as string) || (parsedData?.event as string) || "").toString().toLowerCase();
      const rawScore = parsedData?.score ?? (parsedData?.payload as Record<string, unknown>)?.score ?? (parsedData?.value as unknown) ?? parsedData;
      let score = Number(rawScore);
      if (Number.isNaN(score)) score = 0;
      const matchIdFromGame = (parsedData?.matchId as string) || ((parsedData?.payload as Record<string, unknown>)?.matchId as string) || matchId;

      if (score >= 0) {
        setMyScore((prev) => {
          const maxScore = prev === null ? score : Math.max(prev, score);
          return maxScore;
        });
      }

      if (eventType === "game_score" || eventType === "score") {
        return;
      }

      if (eventType === "game_over" || eventType === "game_end" || eventType === "gamefinished") {
        setIsGameOver(true);
        if (!user?.id || user.id === "anonimo") {
          console.warn("Game over omite guardado: usuario no válido", user?.id);
          return;
        }
        if (score >= 0) {
          await submitAndCheckScore(score, matchIdFromGame && isUuid(matchIdFromGame) ? matchIdFromGame : undefined);
        }
      }
    };

    window.addEventListener("message", handleGameMessage);

    return () => {
      window.removeEventListener("message", handleGameMessage);
    };
  }, [game?.id, user?.id, matchId, submitAndCheckScore]);

  useEffect(() => {
    const loadMyScore = async () => {
      if (!user?.id || !game?.id) return;

      setScoreLoading(true);
      try {
        const score = await getUserGameScore(user.id, game.id);
        setMyScore(score);

        if (score !== null) {
          await checkAndAwardAchievements(user.id, game.id, score);
        }
      } catch (error) {
        console.error("Error cargando mi score:", error);
        setMyScore(null);
      } finally {
        setScoreLoading(false);
      }
    };

    loadMyScore();
  }, [user?.id, game?.id]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-300 text-lg font-medium animate-pulse">
            {t("gameplay.loading")}
          </p>
        </div>
      </div>
    );

  if (!game)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <p className="text-red-400 text-lg font-semibold">
            {t("gameplay.notFound")}
          </p>
          <button
            onClick={() => navigate("/juegos")}
            className="mt-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            {t("gameplay.backToGames")}
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800">
        <div className="mx-auto w-full max-w-[1200px] px-8 lg:px-14 py-4 flex items-center justify-between">
          <div className="max-w-[70%]">
            <h1 className="text-xl font-semibold leading-tight">{game.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              {game.genre ?? t("gameplay.noGenre")} {game.rating ? `· ⭐ ${game.rating}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/ranking?gameId=${game.id}`)}
              className="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
            >
              {t("gameplay.viewRanking")}
            </button>
          </div>
        </div>
      </div>

      {isGameOver && (
        <div className="mx-auto w-full max-w-[1200px] px-8 lg:px-14 py-4">
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 mb-4">
            <p className="text-sm text-emerald-300">Juego finalizado: tu puntuación se ha guardado automáticamente.</p>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1200px] px-8 lg:px-14 py-4">
        {isGameOwner && (
          <section className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4">
            <h2 className="text-lg font-semibold">Configuración de logros (creador del juego)</h2>
            <p className="text-xs text-slate-300 mb-3">Crea logros únicos por juego y criterios de desbloqueo.</p>
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
              <input
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                placeholder="Título del logro"
                value={newAchievement.title}
                onChange={(e) => setNewAchievement((prev) => ({ ...prev, title: e.target.value }))}
              />
              <input
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                placeholder="Descripción"
                value={newAchievement.description}
                onChange={(e) => setNewAchievement((prev) => ({ ...prev, description: e.target.value }))}
              />
              <select
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                value={newAchievement.criteriaType}
                onChange={(e) => setNewAchievement((prev) => ({
                  ...prev,
                  criteriaType: e.target.value as "score_min" | "rank_top" | "manual",
                }))}
              >
                <option value="score_min">Mayor puntaje (score_min)</option>
                <option value="rank_top">Ranking top (rank_top)</option>
                <option value="manual">Manual</option>
              </select>
              <input
                type="number"
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
                placeholder="Valor de criterio"
                value={newAchievement.criteriaValue}
                onChange={(e) => setNewAchievement((prev) => ({ ...prev, criteriaValue: Number(e.target.value) }))}
              />
            </div>
            <button
              onClick={handleCreateAchievement}
              disabled={achLoading || !newAchievement.title.trim() || !newAchievement.description.trim()}
              className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-45"
            >
              {achLoading ? "Guardando..." : "Crear logro"}
            </button>
          </section>
        )}

        <section className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-lg font-semibold mb-2">Logros del juego</h3>
          {achLoading ? (
            <p>Cargando logros...</p>
          ) : achievements.length === 0 ? (
            <p>No hay logros definidos para este juego.</p>
          ) : (
            <ul className="space-y-2">
              {achievements.map((achievement) => (
                <li key={achievement.id} className="rounded-lg border border-indigo-500/30 p-3">
                  <p className="font-semibold">{achievement.title}</p>
                  <p className="text-sm text-slate-300">{achievement.description}</p>
                  <p className="text-xs text-slate-400">
                    Criterio: {achievement.criteria_type} - {achievement.criteria_value}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 mb-6">
        <div className="mx-auto w-full max-w-[1200px] px-8 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-[800px_280px] gap-4 justify-center items-stretch">
            <section className="h-[600px] w-full max-w-[800px] rounded-xl overflow-hidden bg-black border border-indigo-500/50 shadow-xl shadow-indigo-500/10 transition-all duration-300">
              <GameViewport src={finalGameUrl} title={`game-${game.id}`} ratio="4:3" />
            </section>

            <GameplaySidebar
              myScore={myScore}
              scoreLoading={scoreLoading}
              availableModes={game.available_modes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}