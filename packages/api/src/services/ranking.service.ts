import type { SupabaseClient } from "@supabase/supabase-js";
import { insertRankingScoreEvent } from "../repositories/ranking.repository";

export async function registrarPuntos(
  client: SupabaseClient,
  userId: string,
  puntos: number,
  nombreHito: string,
) {
  if (!Number.isFinite(puntos) || puntos <= 0) {
    return { data: null, error: "Los puntos deben ser un número positivo válido." };
  }

  const LIMITE_SEGURIDAD = 1000;
  if (puntos > LIMITE_SEGURIDAD) {
    return { data: null, error: "Cantidad de puntos excede el límite permitido." };
  }

  try {
    const { data, error } = await insertRankingScoreEvent(client, {
      userId,
      points: puntos,
      milestoneName: nombreHito,
      createdAt: new Date().toISOString(),
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}