import type { MatchPlayer } from "../hooks/useActiveMatch";

type Props = {
  players: MatchPlayer[];
  currentUserId: string | null;
  loading?: boolean;
};

function PlayerAvatar({ player, isCurrentUser }: { player: MatchPlayer; isCurrentUser: boolean }) {
  const initials = player.username
    ? player.username.slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="flex items-center gap-2">
      {/* Avatar */}
      <div className="relative">
        {player.avatar_url ? (
          <img
            src={player.avatar_url}
            alt={player.username ?? "jugador"}
            className="w-8 h-8 rounded-full object-cover border-2 border-indigo-500/60"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-600/30 border-2 border-indigo-500/60 flex items-center justify-center">
            <span className="text-xs font-bold text-indigo-300">{initials}</span>
          </div>
        )}
        {/* Indicador de jugador activo */}
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-slate-900" />
      </div>

      {/* Nombre */}
      <div className="flex flex-col leading-none">
        <span className="text-sm font-semibold text-white">
          {player.username ?? "Jugador"}
        </span>
        {isCurrentUser && (
          <span className="text-[10px] text-indigo-400 font-medium">Tú</span>
        )}
      </div>
    </div>
  );
}

export default function PlayersBar({ players, currentUserId, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 mb-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
        <div className="h-3 w-20 rounded bg-slate-800 animate-pulse" />
        <div className="h-3 w-6 rounded bg-slate-800 animate-pulse mx-2" />
        <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
        <div className="h-3 w-20 rounded bg-slate-800 animate-pulse" />
      </div>
    );
  }

  if (!players.length) return null;

  return (
    <div className="flex items-center gap-4 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 mb-3">
      {players.map((player, i) => (
        <div key={player.id} className="flex items-center gap-4">
          <PlayerAvatar
            player={player}
            isCurrentUser={player.id === currentUserId}
          />
          {/* Separador "vs" entre jugadores */}
          {i < players.length - 1 && (
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">vs</span>
          )}
        </div>
      ))}
    </div>
  );
}
