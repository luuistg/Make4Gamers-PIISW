export type AchievementPlatformScope = "all" | "web" | "mobile";

export type Achievement = {
  id: string;
  code: string;
  title: string;
  description: string;
  platform_scope: AchievementPlatformScope;
  badge_icon: string | null;
  is_active: boolean;
  created_at: string;
};

export type UserAchievementMetadata = Record<string, unknown>;

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  source: string | null;
  metadata: UserAchievementMetadata;
  created_at: string;
};

export type UserAchievementWithAchievement = UserAchievement & {
  achievement: Achievement;
};

export type AchievementUnlockStatus = "unlocked" | "already_unlocked" | "requires_auth";

export type AchievementUnlockResult = {
  status: AchievementUnlockStatus;
  achievement: Achievement | null;
  userAchievement: UserAchievement | null;
};
