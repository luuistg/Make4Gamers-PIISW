import type { Game } from '../types/game'
import type { CatalogGame } from '../types/catalog-game'

const genreAccents: Record<string, [string, string]> = {
  idle: ['#7c3aed', '#1d4ed8'],
  action: ['#4338ca', '#0f172a'],
  arcade: ['#0f766e', '#1d4ed8'],
  rpg: ['#4d7c0f', '#14532d'],
  puzzle: ['#7c3aed', '#1e1b4b'],
  strategy: ['#be123c', '#1e293b'],
  adventure: ['#2563eb', '#0f172a'],
}

const statusTags: Record<string, string> = {
  published: 'ACTIVO',
  review: 'DESTACADO',
  beta: 'NUEVO',
  featured: 'NUEVO',
  qa: 'PROXIMO',
  draft: 'PROXIMAMENTE',
}

const statusLabels: Record<string, string> = {
  published: 'Disponible',
  review: 'Seleccionado',
  beta: 'Nuevo',
  featured: 'Nuevo',
  qa: 'Proximamente',
  draft: 'Proximamente',
}

function getAccent(game: Game): [string, string] {
  const normalizedGenre = (game.genre ?? '').toLowerCase()
  return genreAccents[normalizedGenre] ?? ['#312e81', '#0f172a']
}

function getDeveloperName(game: Game) {
  if (!game.developer_id) {
    return 'Developer Studio'
  }

  return `Studio ${game.developer_id.slice(0, 8)}`
}

function getBlurb(game: Game) {
  if (game.description) {
    return game.description
  }

  return `${game.title} forma parte del catalogo y puede abrirse tambien desde movil.`
}

export function getGameStatusLabel(status: string | null | undefined) {
  if (!status) {
    return 'Catalogo'
  }

  return statusLabels[status] ?? status.replace(/[-_]+/g, ' ')
}

function getReleaseLabel(game: Game) {
  const versionLabel = game.version ? `Version ${game.version}` : 'Version no indicada'
  const statusLabel = getGameStatusLabel(game.status)
  return `${versionLabel} | ${statusLabel} | disponible en la plataforma`
}

export function mapPlatformGame(game: Game): CatalogGame {
  return {
    ...game,
    developerName: getDeveloperName(game),
    tag: statusTags[game.status] ?? 'CATALOGO',
    blurb: getBlurb(game),
    accent: getAccent(game),
    featured: (game.rating ?? 0) >= 4.5 || game.status === 'published',
    playable: /^https?:\/\//i.test(game.game_url),
    releaseLabel: getReleaseLabel(game),
  }
}
