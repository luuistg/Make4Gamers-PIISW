import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import {
  getAuthenticatedUser as getAuthenticatedUserFromApi,
  getAuthenticatedUserId as getAuthenticatedUserIdFromApi,
  loginWithEmail as loginWithEmailFromApi,
  loginWithGoogle as loginWithGoogleFromApi,
  logout as logoutFromApi,
  registerWithEmail as registerWithEmailFromApi,
  requestPasswordReset as requestPasswordResetFromApi,
  subscribeToAuthState as subscribeToAuthStateFromApi,
} from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";

export function loginWithEmail(email: string, password: string) {
  return loginWithEmailFromApi(supabase, email, password);
}

export function registerWithEmail(input: {
  email: string;
  password: string;
  username: string;
  fullName: string;
}) {
  return registerWithEmailFromApi(supabase, input);
}

export function loginWithGoogle(redirectTo: string) {
  return loginWithGoogleFromApi(supabase, redirectTo);
}

export function requestPasswordReset(email: string, redirectTo: string) {
  return requestPasswordResetFromApi(supabase, email, redirectTo);
}

export function logout() {
  return logoutFromApi(supabase);
}

export function getAuthenticatedUserId() {
  return getAuthenticatedUserIdFromApi(supabase);
}

export function getAuthenticatedUser() {
  return getAuthenticatedUserFromApi(supabase);
}

export function subscribeToAuthState(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  return subscribeToAuthStateFromApi(supabase, callback);
}