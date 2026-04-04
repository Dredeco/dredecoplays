"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import { getToken, getUser, removeToken, setToken, setUser } from "./session-store";
import type { User } from "./types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    setTokenState(getToken());
    setUserState(getUser());
    setMounted(true);
  }, []);

  const setSession = useCallback((t: string, u: User) => {
    setToken(t);
    setUser(u);
    setTokenState(t);
    setUserState(u);
  }, []);

  const clearSession = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUserState(null);
  }, []);

  const value = useMemo(
    () =>
      mounted
        ? { user, token, setSession, clearSession }
        : {
            user: null,
            token: null,
            setSession,
            clearSession,
          },
    [mounted, user, token, setSession, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
