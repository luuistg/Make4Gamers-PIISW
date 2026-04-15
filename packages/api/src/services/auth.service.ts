import type {
  AuthChangeEvent,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";
import {
  getCurrentUser,
  getCurrentUserId,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithGoogle,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  updateCurrentUserMetadata,
} from "../repositories/auth.repository";

export function loginWithEmail(client: SupabaseClient, email: string, password: string) {
  return signInWithPassword(client, email, password);
}

export function registerWithEmail(
  client: SupabaseClient,
  input: {
    email: string;
    password: string;
    username: string;
    fullName: string;
  },
) {
  return signUpWithPassword(client, input);
}

export function loginWithGoogle(client: SupabaseClient, redirectTo: string) {
  return signInWithGoogle(client, redirectTo);
}

export function requestPasswordReset(client: SupabaseClient, email: string, redirectTo: string) {
  return sendPasswordResetEmail(client, email, redirectTo);
}

export function updateAuthenticatedUserMetadata(
  client: SupabaseClient,
  data: Record<string, unknown>,
) {
  return updateCurrentUserMetadata(client, data);
}

export async function logout(client: SupabaseClient): Promise<void> {
  const { error } = await signOut(client);
  if (error) throw error;
}

export function getAuthenticatedUserId(client: SupabaseClient) {
  return getCurrentUserId(client);
}

export function getAuthenticatedUser(client: SupabaseClient) {
  return getCurrentUser(client);
}

export function subscribeToAuthState(
  client: SupabaseClient,
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  return onAuthStateChanged(client, callback);
}
