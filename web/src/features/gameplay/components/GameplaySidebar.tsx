import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGameScore } from "../hooks/useGameScore";
import type { MatchMovement } from "../hooks/useMatchMovements";

export type GameplayTab = "chat" | "history";

// Claves internas que no tienen valor para el jugador
const SKIP_KEYS = new Set(["game_id"]);

function formatKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return "-";
  if (typeof val === "boolean") return val ? "Sí" : "No";
  return String(val);
}

function MoveCard({ movement }: { movement: MatchMovement }) {
  const time = new Date(movement.server_timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const entries = Object.entries(movement.move_data).filter(
    ([key]) => !SKIP_KEYS.has(key),
  );

  return (
    <li className="bg-slate-800 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
          Turno {typeof movement.move_data.turn === "number" ? movement.move_data.turn : "—"}
        </span>
        <span className="text-[10px] text-slate-500">{time}</span>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
        {entries.map(([key, val]) => {
          if (key === "turn") return null;
          return (
            <div key={key} className="flex flex-col">
              <dt className="text-[10px] text-slate-500 leading-none">{formatKey(key)}</dt>
              <dd className="text-xs font-semibold text-white leading-snug">{formatValue(val)}</dd>
            </div>
          );
        })}
      </dl>
    </li>
  );
}

type Props = {
  userId: string | null;
  gameId: string | null;
  movements: MatchMovement[];
  availableModes?: string[] | null;
};

export default function GameplaySidebar({
  userId,
  gameId,
  movements,
  availableModes,
}: Props) {
  const { t } = useTranslation();
  const { score: myScore, loading: scoreLoading } = useGameScore(userId, gameId);

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
          {movements.length > 0 && (
            <span className="ml-1.5 text-[10px] bg-indigo-500/20 text-indigo-400 rounded-full px-1.5 py-0.5">
              {movements.length}
            </span>
          )}
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
        /* Historial */
        <div className="flex-1 overflow-auto p-3">
          {!supportsHistory ? (
            <p className="text-slate-500 text-sm">{t("gameplay.noMovesRequired")}</p>
          ) : movements.length === 0 ? (
            <p className="text-slate-500 text-sm">{t("gameplay.noMovesYet")}</p>
          ) : (
            <ul className="space-y-2">
              {[...movements].reverse().map((m) => (
                <MoveCard key={m.id} movement={m} />
              ))}
            </ul>
          )}
        </div>
      )}
    </aside>
  );
}
