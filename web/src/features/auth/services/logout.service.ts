import { logout as logoutFromAuthService } from './auth.service';

export async function logout(): Promise<void> {
  await logoutFromAuthService();
}