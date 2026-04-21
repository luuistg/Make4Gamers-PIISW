import type { SupabaseClient } from "@supabase/supabase-js";

export async function insertUserReport(
  client: SupabaseClient,
  input: {
    reporterId: string;
    reportedId: string;
    reason: string;
    details?: string;
  }
): Promise<void> {
  const { error } = await client.from("user_reports").insert([
    {
      reporter_id: input.reporterId,
      reported_id: input.reportedId,
      reason: input.reason,
      details: input.details || null,
    },
  ]);

  if (error) {
    throw new Error(error.message || "No se pudo enviar el reporte");
  }
}