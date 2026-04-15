import type { SupabaseClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "../repositories/auth.repository";
import {
  findAchievementByCode,
  findUserAchievement,
  findUserAchievements,
  insertUserAchievement,
} from "../repositories/achievements.repository";
import type {
  Achievement,
  AchievementPlatformScope,
  AchievementUnlockResult,
  UserAchievementMetadata,
  UserAchievementWithAchievement,
} from "../types/achievement";

export const MOBILE_FIRST_GAME_ACHIEVEMENT_CODE = "mobile_first_game_launch";

function supportsPlatform(
  achievement: Achievement,
  platformScope: AchievementPlatformScope | undefined,
) {
  if (!platformScope) {
    return true;
  }

  return achievement.platform_scope === "all" || achievement.platform_scope === platformScope;
}

export async function getCurrentUserAchievements(
  client: SupabaseClient,
  options?: { platformScope?: AchievementPlatformScope },
): Promise<UserAchievementWithAchievement[]> {
  const userId = await getCurrentUserId(client);
  if (!userId) {
    return [];
  }

  const achievements = await findUserAchievements(client, userId);

  if (!options?.platformScope) {
    return achievements;
  }

  return achievements.filter(({ achievement }) =>
    supportsPlatform(achievement, options.platformScope),
  );
}

export async function unlockAchievementByCode(
  client: SupabaseClient,
  input: {
    code: string;
    platformScope?: AchievementPlatformScope;
    source?: string;
    metadata?: UserAchievementMetadata;
  },
): Promise<AchievementUnlockResult> {
  const userId = await getCurrentUserId(client);
  if (!userId) {
    return {
      status: "requires_auth",
      achievement: null,
      userAchievement: null,
    };
  }

  const achievement = await findAchievementByCode(client, input.code);
  if (!achievement) {
    throw new Error(`No existe un logro activo con el codigo "${input.code}"`);
  }

  if (!supportsPlatform(achievement, input.platformScope)) {
    throw new Error("El logro encontrado no corresponde con la plataforma solicitada");
  }

  const existingAchievement = await findUserAchievement(client, {
    userId,
    achievementId: achievement.id,
  });

  if (existingAchievement) {
    return {
      status: "already_unlocked",
      achievement,
      userAchievement: existingAchievement,
    };
  }

  const userAchievement = await insertUserAchievement(client, {
    userId,
    achievementId: achievement.id,
    source: input.source,
    metadata: input.metadata,
  });

  return {
    status: "unlocked",
    achievement,
    userAchievement,
  };
}

export function unlockMobileFirstGameAchievement(
  client: SupabaseClient,
  input: {
    gameId: string;
    gameTitle?: string;
  },
) {
  const metadata: UserAchievementMetadata = {
    event: "first_game_launch",
    gameId: input.gameId,
    platform: "mobile",
  };

  if (input.gameTitle) {
    metadata.gameTitle = input.gameTitle;
  }

  return unlockAchievementByCode(client, {
    code: MOBILE_FIRST_GAME_ACHIEVEMENT_CODE,
    platformScope: "mobile",
    source: "game_launch",
    metadata,
  });
}
