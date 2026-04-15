import type { SupabaseClient } from '@supabase/supabase-js'

import type { Game } from '../types/game'

const GAME_SELECT_FIELDS = `
  id,
  developer_id,
  title,
  slug,
  description,
  thumbnail_url,
  game_url,
  manual_url,
  status,
  version,
  genre,
  available_modes,
  created_at,
  updated_at,
  rating,
  players
`

export async function findAllGames(client: SupabaseClient): Promise<Game[]> {
  const { data, error } = await client
    .from('games')
    .select(GAME_SELECT_FIELDS)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message || 'No se pudieron recuperar los juegos')
  }

  return (data ?? []) as Game[]
}

export async function findGameById(client: SupabaseClient, id: string): Promise<Game> {
  const { data, error } = await client
    .from('games')
    .select(GAME_SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'No se encontro el juego')
  }

  return data as Game
}
