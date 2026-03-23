import type {
  AuthChangeEvent,
  EmailOtpType,
  Session,
  SupabaseClient,
  User,
} from "@supabase/supabase-js";

export function signInWithPassword(
  client: SupabaseClient,
  email: string,
  password: string,
) {
  return client.auth.signInWithPassword({ email, password });
}

export function signUpWithPassword(
  client: SupabaseClient,
  input: {
    email: string;
    password: string;
    username: string;
    fullName: string;
  },
) {
  return client.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        username: input.username,
        full_name: input.fullName,
      },
    },
  });
}

export function signInWithGoogle(client: SupabaseClient, redirectTo: string) {
  return client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
}

export function sendPasswordResetEmail(
  client: SupabaseClient,
  email: string,
  redirectTo: string,
) {
  return client.auth.resetPasswordForEmail(email, { redirectTo });
}

export function verifyOtpRecoveryToken(
  client: SupabaseClient,
  tokenHash: string,
  type: EmailOtpType = "recovery",
) {
  return client.auth.verifyOtp({ token_hash: tokenHash, type });
}

export function setSessionFromRecoveryTokens(
  client: SupabaseClient,
  accessToken: string,
  refreshToken: string,
) {
  return client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
}

export function updatePassword(client: SupabaseClient, newPassword: string) {
  return client.auth.updateUser({ password: newPassword });
}

export function signOut(client: SupabaseClient) {
  return client.auth.signOut();
}

export async function getCurrentUserId(client: SupabaseClient): Promise<string | null> {
  const { data } = await client.auth.getUser();
  return data.user?.id ?? null;
}

export async function getCurrentUser(client: SupabaseClient): Promise<User | null> {
  const { data } = await client.auth.getUser();
  return data.user ?? null;
}

export function onAuthStateChanged(
  client: SupabaseClient,
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  return client.auth.onAuthStateChange(callback);
}