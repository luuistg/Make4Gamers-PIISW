import { supabase } from "../../supabase";

type CreateMatchInput = {
  gameId: string;
};

export async function createMatch({ gameId }: CreateMatchInput): Promise<string> {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;
  if (!userId) throw new Error("Usuario no autenticado");

  const isUuid = (value: string | null | undefined): value is string =>
    typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  if (!isUuid(userId)) {
    throw new Error("Usuario no autenticado o ID inválido para crear la partida");
  }

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
    if (error?.message?.includes("Could not find table") || error?.message?.includes("relation \"matches\" does not exist")) {
      throw new Error("No existe la tabla matches en la base de datos. Ejecuta el SQL de migración para crear las tablas necesarias.");
    }

    throw new Error(error?.message || "No se pudo crear la partida");
  }

  return data.id;
}