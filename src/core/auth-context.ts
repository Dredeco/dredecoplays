"use client";

import { createContext, useContext } from "react";
import type { User } from "./types";

export type AuthContextValue = {
  user: User | null;
  token: string | null;
  setSession: (token: string, user: User) => void;
  clearSession: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext(): AuthContextValue | null {
  return useContext(AuthContext);
}
