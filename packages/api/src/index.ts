export { createSupabaseClient } from "./supabase/createSupabaseClient";

export { getGames, getGameById } from "./services/games.service";
export {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  requestPasswordReset,
  logout,
  getAuthenticatedUserId,
  getAuthenticatedUser,
  subscribeToAuthState,
} from "./services/auth.service";
export { createMatch } from "./services/matches.service";
export { getUserGameScore } from "./services/scores.service";
export { registrarPuntos } from "./services/ranking.service";

export type { Game } from "./types/game";