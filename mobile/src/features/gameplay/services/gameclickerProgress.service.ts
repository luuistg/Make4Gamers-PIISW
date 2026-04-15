import type { User } from '@supabase/supabase-js'

import {
  getAuthenticatedUser,
  updateAuthenticatedUserMetadata,
} from '@/src/features/auth/services/auth.service'

export type GameClickerOwnedUpgrades = {
  pads: number
  arcades: number
  consoles: number
  studios: number
}

export type GameClickerProgress = {
  version: 1
  bits: number
  lifetimeBits: number
  tapCount: number
  owned: GameClickerOwnedUpgrades
  savedAt: string
}

function normalizeCounter(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return 0
  }

  return Math.floor(value)
}

function normalizeUserMetadata(
  metadata: User['user_metadata'] | Record<string, unknown> | null | undefined,
) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return {}
  }

  return { ...(metadata as Record<string, unknown>) }
}

function normalizeOwnedUpgrades(value: unknown): GameClickerOwnedUpgrades {
  const record =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}

  return {
    pads: normalizeCounter(record.pads),
    arcades: normalizeCounter(record.arcades),
    consoles: normalizeCounter(record.consoles),
    studios: normalizeCounter(record.studios),
  }
}

export function createEmptyGameClickerOwnedUpgrades(): GameClickerOwnedUpgrades {
  return {
    pads: 0,
    arcades: 0,
    consoles: 0,
    studios: 0,
  }
}

export function buildGameClickerProgress(input: {
  bits: number
  lifetimeBits: number
  tapCount: number
  owned: GameClickerOwnedUpgrades
}): GameClickerProgress {
  return {
    version: 1,
    bits: normalizeCounter(input.bits),
    lifetimeBits: normalizeCounter(input.lifetimeBits),
    tapCount: normalizeCounter(input.tapCount),
    owned: normalizeOwnedUpgrades(input.owned),
    savedAt: new Date().toISOString(),
  }
}

export function createGameClickerProgressSignature(
  progress: Pick<GameClickerProgress, 'bits' | 'lifetimeBits' | 'tapCount' | 'owned'>,
) {
  return JSON.stringify({
    bits: normalizeCounter(progress.bits),
    lifetimeBits: normalizeCounter(progress.lifetimeBits),
    tapCount: normalizeCounter(progress.tapCount),
    owned: normalizeOwnedUpgrades(progress.owned),
  })
}

export function parseGameClickerProgress(value: unknown): GameClickerProgress | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  const candidate = value as Record<string, unknown>

  return {
    version: 1,
    bits: normalizeCounter(candidate.bits),
    lifetimeBits: normalizeCounter(candidate.lifetimeBits),
    tapCount: normalizeCounter(candidate.tapCount),
    owned: normalizeOwnedUpgrades(candidate.owned),
    savedAt: typeof candidate.savedAt === 'string' ? candidate.savedAt : '',
  }
}

export async function loadGameClickerProgress() {
  const user = await getAuthenticatedUser()
  const metadata = normalizeUserMetadata(user?.user_metadata)

  return {
    user,
    metadata,
    progress: parseGameClickerProgress(metadata.gameclicker_progress),
  }
}

export async function saveGameClickerProgress(
  progress: GameClickerProgress,
  metadata: Record<string, unknown>,
) {
  const nextMetadata = {
    ...metadata,
    gameclicker_progress: progress,
  }

  const { data, error } = await updateAuthenticatedUserMetadata(nextMetadata)

  if (error) {
    throw error
  }

  return {
    user: data.user ?? null,
    metadata: normalizeUserMetadata(data.user?.user_metadata ?? nextMetadata),
  }
}
