import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGameScore } from "../hooks/useGameScore";
import { useMatchMovements } from "../hooks/useMatchMovements";

export type GameplayTab = "chat" | "history";

type Props = {
  userId: string | null;
  gameId: string | null;
  matchId: string | null;
  availableModes?: string[] | null;
};

export default function GameplaySidebar({
  userId,
  gameId,
  matchId,
  availableModes,
}: Props) {
  const { t } = useTranslation();
  const { score: myScore, loading: scoreLoading } = useGameScore(userId, gameId);
  const { movements, loading: movementsLoading } = useMatchMovements(matchId, userId);

  const [tab, setTab] = useState<GameplayTab>("chat");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  const supportsHistory = useMemo(() => {
    const modes = availableModes ?? [];
    return modes.some((m) =>
      ["turns", "turn-based", "history", "multiplayer"].includes(m.toLowerCase()),
    );
  }, [availableModes]);

  const sendChat = () => {
    const value = chatInput.trim();
    if (!value) return;
    setChatMessages((prev) => [...prev, value]);
    setChatInput("");
  };

  return (
    <aside className="h-[600px] rounded-xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
      {/* Score */}
      <div className="px-4 py-3 border-b border-indigo-500/50 bg-slate-900 shadow-xl shadow-indigo-500/10">
        <p className="text-xs uppercase tracking-wide text-slate-300">{t("gameplay.myScore")}</p>
        <p className="text-2xl font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.35)] mt-1">
          {scoreLoading ? "..." : myScore ?? "-"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setTab("chat")}
          className={`flex-1 py-2 text-sm transition-all duration-200 ${
            tab === "chat" ? "text-indigo-400 font-semibold scale-105" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {t("gameplay.chat")}
        </button>
        <button
          onClick={() => setTab("history")}
          className={`flex-1 py-2 text-sm transition-all duration-200 ${
            tab === "history" ? "text-indigo-400 font-semibold scale-105" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {t("gameplay.history")}
        </button>
      </div>

      {/* Chat */}
      {tab === "chat" ? (
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {chatMessages.length === 0 ? (
              <p className="text-slate-500 text-sm">{t("gameplay.noMessages")}</p>
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
              placeholder={t("gameplay.writeMessage")}
              className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm outline-none"
            />
            <button onClick={sendChat} className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-sm">
              {t("gameplay.send")}
            </button>
          </div>
        </div>
      ) : (
        /* Historial de movimientos en tiempo real */
        <div className="flex-1 overflow-auto p-3">
          {!supportsHistory ? (
            <p className="text-slate-500 text-sm">{t("gameplay.noMovesRequired")}</p>
          ) : movementsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : movements.length === 0 ? (
            <p className="text-slate-500 text-sm">{t("gameplay.noMovesYet")}</p>
          ) : (
            <ul className="space-y-2">
              {[...movements].reverse().map((m) => {
                const moveLabel =
                  typeof m.move_data?.move === "string"
                    ? m.move_data.move
                    : JSON.stringify(m.move_data);
                const time = new Date(m.server_timestamp).toLocaleTimeString();

                return (
                  <li key={m.id} className="text-sm bg-slate-800 rounded p-2">
                    <div className="font-medium text-white">{moveLabel}</div>
                    <div className="text-xs text-slate-400">{time}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </aside>
  );
}
