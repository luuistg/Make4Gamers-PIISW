export { createSupabaseClient } from "./supabase/createSupabaseClient";

export { getGames, getGameById } from "./services/games.service";
export {
  getCurrentUserAchievements,
  unlockAchievementByCode,
  unlockMobileFirstGameAchievement,
  MOBILE_FIRST_GAME_ACHIEVEMENT_CODE,
} from "./services/achievements.service";
export {
  registerTrackedGamePlaytime,
  MOBILE_ONE_HOUR_SINGLE_GAME_ACHIEVEMENT_CODE,
} from "./services/gameplay-stats.service";
export {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  requestPasswordReset,
  updateAuthenticatedUserMetadata,
  logout,
  getAuthenticatedUserId,
  getAuthenticatedUser,
  subscribeToAuthState,
} from "./services/auth.service";
export { createMatch } from "./services/matches.service";
export { getUserGameScore } from "./services/scores.service";
export { registrarPuntos } from "./services/ranking.service";

export type { Game } from "./types/game";
export type {
  Achievement,
  AchievementPlatformScope,
  AchievementUnlockResult,
  AchievementUnlockStatus,
  UserAchievement,
  UserAchievementMetadata,
  UserAchievementWithAchievement,
} from "./types/achievement";
export type {
  RegisterGamePlaytimeResult,
  RegisterGamePlaytimeStatus,
  UserGameplayStat,
} from "./types/gameplay-stat";
