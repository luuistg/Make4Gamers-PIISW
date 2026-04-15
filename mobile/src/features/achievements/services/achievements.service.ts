import {
  getCurrentUserAchievements as getCurrentUserAchievementsFromApi,
  unlockMobileFirstGameAchievement as unlockMobileFirstGameAchievementFromApi,
  type AchievementPlatformScope,
  type AchievementUnlockResult,
  type UserAchievementWithAchievement,
} from '../../../../../packages/api/src/index'

import { supabase } from '@/lib/supabase'

type ApiSupabaseClient = Parameters<typeof unlockMobileFirstGameAchievementFromApi>[0]

export type { AchievementUnlockResult, UserAchievementWithAchievement }
export type { AchievementPlatformScope }

export async function getCurrentUserAchievements(options?: {
  platformScope?: AchievementPlatformScope
}): Promise<UserAchievementWithAchievement[]> {
  if (!supabase) {
    return []
  }

  return getCurrentUserAchievementsFromApi(supabase as unknown as ApiSupabaseClient, options)
}

export async function unlockMobileFirstGameAchievement(input: {
  gameId: string
  gameTitle?: string
}): Promise<AchievementUnlockResult> {
  if (!supabase) {
    return {
      status: 'requires_auth',
      achievement: null,
      userAchievement: null,
    }
  }

  return unlockMobileFirstGameAchievementFromApi(
    supabase as unknown as ApiSupabaseClient,
    input,
  )
}
