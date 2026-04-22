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
  updatePassword as updatePasswordFromApi,
  verifyCurrentPassword as verifyCurrentPasswordFromApi,
} from "../../../../../packages/api/src";
import { supabase } from "../../../supabase";


import { updateUserStatus } from "../../chat/services/chat.service";

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


export async function logout() {
  try {

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await updateUserStatus(user.id, 'Invisible');
    }
  } catch (error) {
    console.error("Error al actualizar estado antes de cerrar sesión:", error);
  }

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

export function updatePassword(newPassword: string) {
  return updatePasswordFromApi(supabase, newPassword);
}

export function verifyCurrentPassword(currentPassword: string) {
  return verifyCurrentPasswordFromApi(supabase, currentPassword);
}