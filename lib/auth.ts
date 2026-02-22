const TOKEN_KEY = "auth_token";
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

export function getToken(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  if (isClient()) {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  }
}
