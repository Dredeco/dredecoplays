import type { User } from "./types";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const TOKEN_COOKIE = "auth_token";

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function setToken(token: string): void {
  if (isClient()) {
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`; // 7 dias
  }
}

export function setUser(user: User): void {
  if (isClient()) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getUser(): User | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  if (isClient()) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  }
}
