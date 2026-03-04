import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getGameById, type Game } from "../services/games/getGameById.service";
import { createMatch } from "../services/matches/createMatch.service";
import { getUserGameScore } from "../services/scores/getUserGameScore.service";

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

  useEffect(() => {
    const loadGame = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getGameById(id);
        setGame(data);
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
        console.log("[Gameplay] match creado:", newMatchId);
      } catch (error) {
        console.error("Error creando match:", error);
      }
    };

    initMatch();
  }, [game?.id, user?.id, matchId]);

  const finalGameUrl = useMemo(() => {
    if (!game?.game_url) return "";

    const playerName = user?.id || "anonimo";
    const currentMatchId = matchId || "";
    const currentGameId = game.id || id || "";

    const url = new URL(game.game_url);
    url.searchParams.set("player", playerName);
    url.searchParams.set("matchId", currentMatchId);
    url.searchParams.set("gameId", currentGameId);

    return url.toString();
  }, [game, id, user, matchId]);

  useEffect(() => {
    if (finalGameUrl) {
      console.log("[Gameplay] finalGameUrl:", finalGameUrl);
    }
  }, [finalGameUrl]);

  useEffect(() => {
    const loadMyScore = async () => {
      if (!user?.id || !game?.id) return;

      setScoreLoading(true);
      try {
        const score = await getUserGameScore(user.id, game.id);
        setMyScore(score);
      } catch (error) {
        console.error("Error cargando mi score:", error);
        setMyScore(null);
      } finally {
        setScoreLoading(false);
      }
    };

    loadMyScore();
  }, [user?.id, game?.id]);

  if (loading) return <div className="p-6 text-slate-300">{t("gameplay.loading")}</div>;
  if (!game) return <div className="p-6 text-red-400">{t("gameplay.notFound")}</div>;

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

          <button
            onClick={() => navigate(`/ranking?gameId=${game.id}`)}
            className="shrink-0 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
          >
            {t("gameplay.viewRanking")}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="mx-auto w-full max-w-[1200px] px-8 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-[800px_280px] gap-4 justify-center items-stretch">
            <section className="h-[600px] w-[800px] rounded-xl overflow-hidden bg-black border border-indigo-500/50 shadow-xl shadow-indigo-500/10 transition-all duration-300">
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