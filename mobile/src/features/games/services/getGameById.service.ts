import { supabase } from '@/lib/supabase'

import { mockGames } from '../data/mock-games'
import { mapPlatformGame } from './catalogGame.mapper'
import { findGameById } from './games.repository'
import type { CatalogGame } from '../types/catalog-game'

export type { CatalogGame }

export async function getGameById(id: string): Promise<CatalogGame> {
  const localGame = mockGames.find((entry) => entry.id === id && entry.localRoute)

  if (localGame) {
    return localGame
  }

  if (supabase) {
    try {
      const game = await findGameById(supabase, id)
      return mapPlatformGame(game)
    } catch {
      // Fallback silencioso al catalogo local para mantener la experiencia.
    }
  }

  const game = mockGames.find((entry) => entry.id === id)

  if (!game) {
    throw new Error(`Game with id "${id}" was not found`)
  }

  return game
}
