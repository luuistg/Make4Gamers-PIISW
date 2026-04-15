import type { Game } from './game'

export type CatalogGame = Game & {
  developerName: string
  tag: string
  blurb: string
  accent: [string, string]
  featured?: boolean
  playable?: boolean
  localRoute?: string
  releaseLabel: string
}
