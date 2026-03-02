import { supabase } from '@/core/config';

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.replace('/login');
}
