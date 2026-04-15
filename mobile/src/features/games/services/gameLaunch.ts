import 'react-native-url-polyfill/auto'

import type { CatalogGame } from '../types/catalog-game'

const webAppUrl = process.env.EXPO_PUBLIC_WEB_APP_URL?.trim()

export function canOpenRemoteGameUrl(gameUrl: string | null | undefined) {
  return /^https?:\/\//i.test(gameUrl ?? '')
}

export function buildGameLaunchUrl(game: Pick<CatalogGame, 'game_url' | 'id'>) {
  if (webAppUrl) {
    const url = new URL(`/game/${game.id}`, webAppUrl)
    url.searchParams.set('platform', 'mobile')
    return url.toString()
  }

  if (!canOpenRemoteGameUrl(game.game_url)) {
    return null
  }

  const url = new URL(game.game_url)
  url.searchParams.set('player', 'anonimo')
  url.searchParams.set('matchId', '')
  url.searchParams.set('gameId', game.id)
  url.searchParams.set('platform', 'mobile')
  return url.toString()
}
