import { useEffect, useState } from "react";
import {
  getAuthenticatedUser,
  subscribeToAuthState,
} from "../services/auth.service";

type AuthUser = Awaited<ReturnType<typeof getAuthenticatedUser>>;

export const useAuthStatus = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser>(null);

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      const userObj = await getAuthenticatedUser();
      if (!mounted) return;
      setUser(userObj);
      setIsAuthenticated(!!userObj);
      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = subscribeToAuthState((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { loading, isAuthenticated, user };
};