import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import {
  getAuthenticatedUser as getAuthenticatedUserFromApi,
  getAuthenticatedUserId as getAuthenticatedUserIdFromApi,
  loginWithEmail as loginWithEmailFromApi,
  loginWithGoogle as loginWithGoogleFromApi,
  logout as logoutFromApi,
  registerWithEmail as registerWithEmailFromApi,
  requestPasswordReset as requestPasswordResetFromApi,
  subscribeToAuthState as subscribeToAuthStateFromApi,
  updateAuthenticatedUserMetadata as updateAuthenticatedUserMetadataFromApi,
} from '../../../../../packages/api/src/index'

import { supabase } from '@/lib/supabase'

const AUTH_CONFIGURATION_ERROR =
  'La autenticacion movil no esta configurada. Revisa EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'

type ApiSupabaseClient = Parameters<typeof loginWithEmailFromApi>[0]
type AuthSubscription = ReturnType<typeof subscribeToAuthStateFromApi>

const noopAuthSubscription: AuthSubscription = {
  data: {
    subscription: {
      id: 'mobile-auth-noop',
      callback: () => undefined,
      unsubscribe: () => undefined,
    },
  },
}

function requireSupabase() {
  if (!supabase) {
    throw new Error(AUTH_CONFIGURATION_ERROR)
  }

  return supabase as unknown as ApiSupabaseClient
}

export function isAuthConfigured() {
  return !!supabase
}

export function loginWithEmail(email: string, password: string) {
  return loginWithEmailFromApi(requireSupabase(), email, password)
}

export function registerWithEmail(input: {
  email: string
  password: string
  username: string
  fullName: string
}) {
  return registerWithEmailFromApi(requireSupabase(), input)
}

export function loginWithGoogle(redirectTo: string) {
  return loginWithGoogleFromApi(requireSupabase(), redirectTo)
}

export function requestPasswordReset(email: string, redirectTo: string) {
  return requestPasswordResetFromApi(requireSupabase(), email, redirectTo)
}

export function updateAuthenticatedUserMetadata(data: Record<string, unknown>) {
  return updateAuthenticatedUserMetadataFromApi(requireSupabase(), data)
}

export function logout() {
  return logoutFromApi(requireSupabase())
}

export function getAuthenticatedUserId() {
  if (!supabase) {
    return Promise.resolve(null)
  }

  return getAuthenticatedUserIdFromApi(supabase as unknown as ApiSupabaseClient)
}

export function getAuthenticatedUser() {
  if (!supabase) {
    return Promise.resolve(null)
  }

  return getAuthenticatedUserFromApi(supabase as unknown as ApiSupabaseClient)
}

export function subscribeToAuthState(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  if (!supabase) {
    return noopAuthSubscription
  }

  return subscribeToAuthStateFromApi(supabase as unknown as ApiSupabaseClient, callback)
}
