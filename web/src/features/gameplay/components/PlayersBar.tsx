import type { MatchPlayer } from "../hooks/useActiveMatch";
import AvatarPlaceholder from "../../../shared/components/AvatarPlaceholder";

type Props = {
  players: MatchPlayer[];
  currentUserId: string | null;
  lastMovedPlayerId: string | null;
  loading?: boolean;
};

function PlayerAvatar({
  player,
  isCurrentUser,
  isActiveTurn,
}: {
  player: MatchPlayer;
  isCurrentUser: boolean;
  isActiveTurn: boolean;
}) {
  const initials = player.username
    ? player.username.slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="flex items-center gap-2.5">
      {/* Avatar con borde de turno */}
      <div className="relative">
        {player.avatar_url ? (
          <img
            src={player.avatar_url}
            alt={player.username ?? "jugador"}
            className={`w-9 h-9 rounded-full object-cover transition-all duration-300 ${
              isActiveTurn
                ? "border-2 border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                : "border-2 border-slate-700"
            }`}
          />
        ) : (
          <div
            className={`rounded-full transition-all duration-300 ${
              isActiveTurn
                ? "border-2 border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                : "border-2 border-slate-700"
            }`}
          >
            <AvatarPlaceholder name={player.username ?? initials} size={36} />
          </div>
        )}

        {/* Punto de estado: parpadea si es su turno */}
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
            isActiveTurn ? "bg-yellow-400 animate-pulse" : "bg-slate-600"
          }`}
        />
      </div>

      {/* Nombre + etiqueta */}
      <div className="flex flex-col leading-none gap-0.5">
        <span className="text-sm font-semibold text-white">
          {player.username ?? "Jugador"}
        </span>
        <span
          className={`text-[10px] font-medium ${
            isActiveTurn
              ? "text-yellow-400"
              : "text-slate-500"
          }`}
        >
          {isActiveTurn
            ? isCurrentUser
              ? "Tu turno"
              : "Su turno"
            : isCurrentUser
              ? "Tú"
              : "Esperando"}
        </span>
      </div>
    </div>
  );
}

export default function PlayersBar({
  players,
  currentUserId,
  lastMovedPlayerId,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center gap-4 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 mb-3">
        <div className="w-9 h-9 rounded-full bg-slate-800 animate-pulse" />
        <div className="h-3 w-20 rounded bg-slate-800 animate-pulse" />
        <div className="h-3 w-6 rounded bg-slate-800 animate-pulse mx-2" />
        <div className="w-9 h-9 rounded-full bg-slate-800 animate-pulse" />
        <div className="h-3 w-20 rounded bg-slate-800 animate-pulse" />
      </div>
    );
  }

  if (!players.length) return null;

  return (
    <div className="flex items-center gap-5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 mb-3">
      {players.map((player, i) => {
        // El que tiene el turno activo es el que NO hizo el último movimiento
        const isActiveTurn =
          lastMovedPlayerId !== null && player.id !== lastMovedPlayerId;

        return (
          <div key={player.id} className="flex items-center gap-5">
            <PlayerAvatar
              player={player}
              isCurrentUser={player.id === currentUserId}
              isActiveTurn={isActiveTurn}
            />
            {i < players.length - 1 && (
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                vs
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
