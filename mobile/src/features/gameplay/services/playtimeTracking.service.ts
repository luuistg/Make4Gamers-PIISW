import {
  registerTrackedGamePlaytime as registerTrackedGamePlaytimeFromApi,
  type RegisterGamePlaytimeResult,
} from '../../../../../packages/api/src/index'

import { supabase } from '@/lib/supabase'

type ApiSupabaseClient = Parameters<typeof registerTrackedGamePlaytimeFromApi>[0]

export type { RegisterGamePlaytimeResult }

export async function registerTrackedGamePlaytime(input: {
  gameId: string
  gameTitle?: string
  additionalSeconds: number
}): Promise<RegisterGamePlaytimeResult> {
  if (!supabase) {
    return {
      status: 'requires_auth',
      addedSeconds: Math.max(0, Math.floor(input.additionalSeconds)),
      gameplayStat: null,
      achievementResult: null,
    }
  }

  return registerTrackedGamePlaytimeFromApi(
    supabase as unknown as ApiSupabaseClient,
    input,
  )
}
