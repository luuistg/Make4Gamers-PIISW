import type { SupabaseClient } from "@supabase/supabase-js";
import { insertUserReport } from "../repositories/reports.repository";

export async function reportUser(
  client: SupabaseClient,
  reporterId: string,
  reportedId: string,
  reason: string,
  details?: string
) {
  // Validaciones básicas de seguridad
  if (!reporterId || !reportedId) {
    return { success: false, error: "Faltan datos de los usuarios." };
  }
  if (!reason) {
    return { success: false, error: "Debes seleccionar un motivo para el reporte." };
  }
  if (reporterId === reportedId) {
    return { success: false, error: "No puedes reportarte a ti mismo." };
  }

  try {
    await insertUserReport(client, { reporterId, reportedId, reason, details });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error en el servicio de reportes:", error);
    return { success: false, error: error.message || "Error al procesar el reporte." };
  }
}