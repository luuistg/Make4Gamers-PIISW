import { supabase } from '@/lib/supabase'

import { mockGames } from '../data/mock-games'
import { mapPlatformGame } from './catalogGame.mapper'
import { findAllGames } from './games.repository'
import type { CatalogGame } from '../types/catalog-game'

export type { CatalogGame }

function mergeCatalogGames(primaryGames: CatalogGame[], secondaryGames: CatalogGame[]) {
  const mergedGames = new Map<string, CatalogGame>()

  primaryGames.forEach((game) => {
    mergedGames.set(game.id, game)
  })

  secondaryGames.forEach((game) => {
    if (!mergedGames.has(game.id)) {
      mergedGames.set(game.id, game)
    }
  })

  return Array.from(mergedGames.values())
}

export async function getGames(): Promise<CatalogGame[]> {
  const localDemos = mockGames.filter((game) => game.localRoute)

  if (supabase) {
    try {
      const liveGames = await findAllGames(supabase)

      if (liveGames.length > 0) {
        return mergeCatalogGames(localDemos, liveGames.map(mapPlatformGame))
      }
    } catch {
      // Fallback silencioso al catalogo local para mantener la app estable.
    }
  }

  return [...mockGames]
}
