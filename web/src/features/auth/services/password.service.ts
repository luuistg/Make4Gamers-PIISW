import { requestPasswordReset } from "./auth.service";

export const PasswordService = {
  async sendResetEmail(email: string) {
    const { data, error } = await requestPasswordReset(email, "http://localhost:5173/actualizar-password");
    
    return { data, error };
  }
};