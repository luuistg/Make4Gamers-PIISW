import { supabase } from "../../supabase";

type CreateMatchInput = {
  gameId: string;
};

export async function createMatch({ gameId }: CreateMatchInput): Promise<string> {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;
  if (!userId) throw new Error("Usuario no autenticado");

  const { data, error } = await supabase
    .from("matches")
    .insert({
      game_id: gameId,
      player_1: userId,
      status: "in_progress",
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    throw new Error(error?.message || "No se pudo crear la partida");
  }

  return data.id;
}