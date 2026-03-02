import { supabase } from "../supabase";

export const PasswordService = {
  async sendResetEmail(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/actualizar-password', 
    });
    
    return { data, error };
  }
};