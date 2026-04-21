import type { SupabaseClient } from "@supabase/supabase-js";
import {
  findGamesToReportByTitle,
  findUsersToReportByUsername,
  insertGameReport,
  insertUserReport,
  type ReportableGameRow,
  type ReportableUserRow,
} from "../repositories/reports.repository";

export type ReportableUser = ReportableUserRow;
export type ReportableGame = ReportableGameRow;

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

export async function searchReportableUsers(
  client: SupabaseClient,
  reporterId: string,
  usernameQuery: string,
): Promise<ReportableUser[]> {
  if (!reporterId) {
    return [];
  }

  const trimmedQuery = usernameQuery.trim();
  if (trimmedQuery.length < 2) {
    return [];
  }

  return findUsersToReportByUsername(client, {
    reporterId,
    usernameQuery: trimmedQuery,
    limit: 10,
  });
}

export async function reportGame(
  client: SupabaseClient,
  reporterId: string,
  gameId: string,
  reason: string,
  details?: string
) {
  if (!reporterId || !gameId) {
    return { success: false, error: "Faltan datos del reporte del juego." };
  }
  if (!reason) {
    return { success: false, error: "Debes seleccionar un motivo para el reporte." };
  }

  try {
    await insertGameReport(client, { reporterId, gameId, reason, details });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error en el servicio de reportes de juegos:", error);
    return { success: false, error: error.message || "Error al procesar el reporte del juego." };
  }
}

export async function searchReportableGames(
  client: SupabaseClient,
  reporterId: string,
  titleQuery: string,
): Promise<ReportableGame[]> {
  if (!reporterId) {
    return [];
  }

  const trimmedQuery = titleQuery.trim();
  if (trimmedQuery.length < 2) {
    return [];
  }

  return findGamesToReportByTitle(client, {
    titleQuery: trimmedQuery,
    limit: 10,
  });
}
