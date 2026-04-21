import {
  reportGame as reportGameFromApi,
  reportUser as reportUserFromApi,
  searchReportableGames as searchReportableGamesFromApi,
  searchReportableUsers as searchReportableUsersFromApi,
  type ReportableGame,
  type ReportableUser,
} from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";

export type { ReportableUser, ReportableGame };

export function reportUser(
  reporterId: string,
  reportedId: string,
  reason: string,
  details?: string,
) {
  return reportUserFromApi(supabase, reporterId, reportedId, reason, details);
}

export function searchReportableUsers(reporterId: string, usernameQuery: string): Promise<ReportableUser[]> {
  return searchReportableUsersFromApi(supabase, reporterId, usernameQuery);
}

export function reportGame(
  reporterId: string,
  gameId: string,
  reason: string,
  details?: string,
) {
  return reportGameFromApi(supabase, reporterId, gameId, reason, details);
}

export function searchReportableGames(reporterId: string, titleQuery: string): Promise<ReportableGame[]> {
  return searchReportableGamesFromApi(supabase, reporterId, titleQuery);
}
