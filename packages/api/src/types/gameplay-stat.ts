import type { AchievementUnlockResult } from "./achievement";

export type UserGameplayStat = {
  id: string;
  user_id: string;
  game_key: string;
  game_title: string | null;
  played_seconds: number;
  last_played_at: string;
  created_at: string;
};

export type RegisterGamePlaytimeStatus = "tracked" | "requires_auth";

export type RegisterGamePlaytimeResult = {
  status: RegisterGamePlaytimeStatus;
  addedSeconds: number;
  gameplayStat: UserGameplayStat | null;
  achievementResult: AchievementUnlockResult | null;
};
