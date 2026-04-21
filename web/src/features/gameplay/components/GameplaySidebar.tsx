import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export type GameplayTab = "chat" | "history";

type MoveItem = {
  id: string;
  move: string;
  at: string;
};

type Props = {
  myScore: number | null;
  scoreLoading: boolean;
  availableModes?: string[] | null;
};

export default function GameplaySidebar({
  myScore,
  scoreLoading,
  availableModes,
}: Props) {
  const { t } = useTranslation();

  const [tab, setTab] = useState<GameplayTab>("chat");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [moves, setMoves] = useState<MoveItem[]>([]);

  const supportsHistory = useMemo(() => {
    const modes = availableModes ?? [];
    return modes.some((m) => ["turns", "turn-based", "history"].includes(m.toLowerCase()));
  }, [availableModes]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg || msg.type !== "GAME_MOVE") return;

      setMoves((prev) => [
        {
          id: crypto.randomUUID(),
          move: msg.payload?.move ?? t("gameplay.noMovesYet"),
          at: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [t]);

  const sendChat = () => {
    const value = chatInput.trim();
    if (!value) return;
    setChatMessages((prev) => [...prev, value]);
    setChatInput("");
  };

  return (
    <aside className="h-[600px] rounded-xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-indigo-500/50 bg-slate-900 shadow-xl shadow-indigo-500/10">
        <p className="text-xs uppercase tracking-wide text-slate-300">{t("gameplay.myScore")}</p>
        <p className="text-2xl font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.35)] mt-1">
          {scoreLoading ? "..." : myScore ?? "-"}
        </p>
      </div>

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

      {tab === "chat" ? (
        <div className="flex flex-col h-full">
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
        <div className="p-3 overflow-auto">
          {!supportsHistory ? (
            <p className="text-slate-500 text-sm">{t("gameplay.noMovesRequired")}</p>
          ) : moves.length === 0 ? (
            <p className="text-slate-500 text-sm">{t("gameplay.noMovesYet")}</p>
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
  );
}