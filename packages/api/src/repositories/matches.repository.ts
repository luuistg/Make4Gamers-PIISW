import type { SupabaseClient } from "@supabase/supabase-js";

export async function insertMatch(
  client: SupabaseClient,
  input: { gameId: string; userId: string; sessionTimerSeconds?: number | null },
): Promise<string> {
  const basePayload = {
    game_id: input.gameId,
    player_1: input.userId,
    status: "in_progress",
  };

  // Best-effort: si el schema todavía no tiene la columna, intentamos insertar sin el timer.
  const payloadWithTimer =
    input.sessionTimerSeconds === undefined
      ? basePayload
      : { ...basePayload, session_timer_seconds: input.sessionTimerSeconds };

  const tryInsert = async (payload: Record<string, unknown>) => {
    const { data, error } = await client
      .from("matches")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data?.id) {
      throw new Error(error?.message || "No se pudo crear la partida");
    }

    return data.id as string;
  };

  try {
    return await tryInsert(payloadWithTimer);
  } catch (err) {
    const message = (err as { message?: string } | undefined)?.message ?? "";

    // Si falla por columnas de timer inexistentes, fallback a inserción básica.
    const looksLikeMissingTimerColumn =
      /session_timer_seconds|column .* does not exist/i.test(message);

    if (!looksLikeMissingTimerColumn) throw err;

    console.warn(
      "[matches.repository] No se pudo insertar session_timer_seconds; creando match sin temporizador.",
      message,
    );
    return await tryInsert(basePayload);
  }
}
