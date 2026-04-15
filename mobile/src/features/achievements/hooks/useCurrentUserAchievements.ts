import { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'

import {
  getCurrentUserAchievements,
  type AchievementPlatformScope,
  type UserAchievementWithAchievement,
} from '../services/achievements.service'

type UseCurrentUserAchievementsOptions = {
  enabled?: boolean
  platformScope?: AchievementPlatformScope
}

export function useCurrentUserAchievements(options?: UseCurrentUserAchievementsOptions) {
  const enabled = options?.enabled ?? true
  const platformScope = options?.platformScope

  const [achievements, setAchievements] = useState<UserAchievementWithAchievement[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  useFocusEffect(
    useCallback(() => {
      let mounted = true

      if (!enabled) {
        setAchievements([])
        setError(null)
        setLoading(false)

        return () => {
          mounted = false
        }
      }

      const loadAchievements = async () => {
        setLoading(true)

        try {
          const currentAchievements = await getCurrentUserAchievements({
            platformScope,
          })

          if (!mounted) {
            return
          }

          setAchievements(currentAchievements)
          setError(null)
        } catch (nextError) {
          if (!mounted) {
            return
          }

          setError(
            nextError instanceof Error ? nextError.message : 'No se pudieron recuperar tus logros',
          )
        } finally {
          if (mounted) {
            setLoading(false)
          }
        }
      }

      void loadAchievements()

      return () => {
        mounted = false
      }
    }, [enabled, platformScope]),
  )

  return {
    achievements,
    loading,
    error,
  }
}
