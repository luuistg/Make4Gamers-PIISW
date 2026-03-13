import { useEffect, useState } from "react";
import {
  getAuthenticatedUser,
  subscribeToAuthState,
} from "../services/auth.service";

export const useAuthStatus = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      const user = await getAuthenticatedUser();

      if (!mounted) return;
      setIsAuthenticated(!!user);
      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = subscribeToAuthState((_event, session) => {
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { loading, isAuthenticated };
};