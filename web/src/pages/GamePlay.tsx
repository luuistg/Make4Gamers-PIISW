import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGameById, type Game } from "../services/games/getGameById.service";
import GameViewport from "../components/gameplay/GameViewport";
import { supabase } from "../supabase";
import { createMatch } from "../services/matches/createMatch.service";
import { getUserGameScore } from "../services/scores/getUserGameScore.service";

type MoveItem = {
  id: string;
  move: string;
  at: string;
};

export default function Gameplay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game | null>(null);
  const [tab, setTab] = useState<"chat" | "history">("chat");

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [moves, setMoves] = useState<MoveItem[]>([]);

  const [user, setUser] = useState<any>(null);
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
    const onMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg || msg.type !== "GAME_MOVE") return;

      setMoves((prev) => [
        {
          id: crypto.randomUUID(),
          move: msg.payload?.move ?? "Movimiento",
          at: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const supportsHistory = useMemo(() => {
    const modes = game?.available_modes ?? [];
    return modes.some((m) =>
      ["turns", "turn-based", "history"].includes(m.toLowerCase())
    );
  }, [game]);

    useEffect(() => {
    const fetchUser = async () => {
        // getUser() es la forma más segura de recuperar la sesión actual
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
        setUser(user);
        } else {
        console.log("No hay usuario autenticado");
        }
    };

    fetchUser();
    }, []);

  const sendChat = () => {
    const value = chatInput.trim();
    if (!value) return;
    setChatMessages((prev) => [...prev, value]);
    setChatInput("");
  };

  useEffect(() => {
    const initMatch = async () => {
      if (!game?.id || !user?.id || matchId) return;

      try {
        const newMatchId = await createMatch({
          gameId: game.id
        });
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

  if (loading) return <div className="p-6 text-slate-300">Cargando juego...</div>;
  if (!game) return <div className="p-6 text-red-400">No se encontró el juego.</div>;


  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{game.title}</h1>
          <p className="text-xs text-slate-400">
            {game.genre ?? "Sin género"} {game.rating ? `· ⭐ ${game.rating}` : ""}
          </p>
        </div>

        <button
          onClick={() => navigate(`/ranking?gameId=${game.id}`)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
        >
          Ver ranking
        </button>
      </div>

      <div className="px-6 lg:px-10 mt-6">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-[800px_280px] gap-3 items-stretch justify-center">
            {/* Juego */}
            <section className="h-[600px] w-[800px] rounded-xl border border-slate-800 bg-black overflow-hidden">
              <GameViewport
                src={finalGameUrl}
                title={`game-${game.id}`}
                ratio="4:3"
              />
            </section>

            {/* Aside más compacto */}
            <aside className="h-[600px] rounded-xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800">
                <p className="text-xs uppercase tracking-wide text-slate-400">Mi score</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {scoreLoading ? "..." : myScore ?? "-"}
                </p>
              </div>

              <div className="flex border-b border-slate-800">
                <button
                  onClick={() => setTab("chat")}
                  className={`flex-1 py-2 text-sm ${
                    tab === "chat" ? "bg-slate-800 text-white" : "text-slate-400"
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setTab("history")}
                  className={`flex-1 py-2 text-sm ${
                    tab === "history" ? "bg-slate-800 text-white" : "text-slate-400"
                  }`}
                >
                  Historial
                </button>
              </div>

              {tab === "chat" ? (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-auto p-3 space-y-2">
                    {chatMessages.length === 0 ? (
                      <p className="text-slate-500 text-sm">Sin mensajes todavía.</p>
                    ) : (
                      chatMessages.map((m, i) => (
                        <div key={i} className="text-sm bg-slate-800 rounded p-2">
                          {m}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-slate-800 flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChat()}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm outline-none"
                    />
                    <button
                      onClick={sendChat}
                      className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-sm"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 overflow-auto">
                  {!supportsHistory ? (
                    <p className="text-slate-500 text-sm">
                      Este juego no requiere historial de movimientos.
                    </p>
                  ) : moves.length === 0 ? (
                    <p className="text-slate-500 text-sm">Sin movimientos aún.</p>
                  ) : (
                    <ul className="space-y-2">
                      {moves.map((m) => (
                        <li key={m.id} className="text-sm bg-slate-800 rounded p-2">
                          <div className="font-medium">{m.move}</div>
                          <div className="text-xs text-slate-400">{m.at}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}