import type {
  AuthChangeEvent,
  EmailOtpType,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";
import {
  getCurrentUser,
  getCurrentUserId,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setSessionFromRecoveryTokens,
  signInWithGoogle,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  updatePassword as updateUserPassword,
  verifyOtpRecoveryToken,
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

export function recoverSessionWithOtpToken(
  client: SupabaseClient,
  tokenHash: string,
  type: EmailOtpType = "recovery",
) {
  return verifyOtpRecoveryToken(client, tokenHash, type);
}

export function recoverSessionWithTokens(
  client: SupabaseClient,
  accessToken: string,
  refreshToken: string,
) {
  return setSessionFromRecoveryTokens(client, accessToken, refreshToken);
}

export function updatePassword(client: SupabaseClient, newPassword: string) {
  return updateUserPassword(client, newPassword);
}

export async function verifyCurrentPassword(client: SupabaseClient, currentPassword: string): Promise<void> {
  const user = await getCurrentUser(client);

  if (!user?.email) {
    throw new Error("No se puede verificar la contraseña actual para esta cuenta");
  }

  const { error } = await signInWithPassword(client, user.email, currentPassword);

  if (error) {
    throw error;
  }
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