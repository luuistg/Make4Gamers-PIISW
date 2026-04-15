export type Game = {
  id: string
  developer_id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  game_url: string
  manual_url: string | null
  status: string
  version: string | null
  genre: string | null
  available_modes: string[] | null
  created_at: string
  updated_at: string
  rating: number | null
  players?: number | null
}
