import { supabase } from "../../supabase";

export type Game = {
  id: string;
  developer_id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  game_url: string;
  manual_url: string | null;
  status: string;
  version: string | null;
  genre: string | null;
  available_modes: string[] | null;
  created_at: string;
  updated_at: string;
  rating: number | null;
};

export async function getGameById(id: string): Promise<Game> {
  const { data, error } = await supabase
    .from("games")
    .select(`
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
      rating
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "No se encontró el juego");
  }

  return data as Game;
}