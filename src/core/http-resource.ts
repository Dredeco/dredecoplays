import type { ApiError, ApiValidationDetail } from "./types";
import { removeToken } from "./session-store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.dredecoplays.com.br";

export { API_URL };

export type ApiClientError = Error & {
  name: "ApiClientError";
  status: number;
  details?: ApiValidationDetail[];
};

export function createApiClientError(
  message: string,
  status: number,
  details?: ApiValidationDetail[],
): ApiClientError {
  const e = new Error(message) as ApiClientError;
  Object.defineProperty(e, "name", { value: "ApiClientError", configurable: true });
  e.status = status;
  e.details = details;
  return e;
}

export function isApiClientError(err: unknown): err is ApiClientError {
  return (
    err instanceof Error &&
    (err as ApiClientError).name === "ApiClientError" &&
    typeof (err as ApiClientError).status === "number"
  );
}

type RequestInitWithToken = RequestInit & { token?: string };

export async function request<T>(
  path: string,
  options: RequestInitWithToken = {},
): Promise<T> {
  const { token, ...init } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  const json = (await res.json().catch(() => ({}))) as ApiError | T | Record<string, unknown>;

  if (!res.ok) {
    const err = json as ApiError;
    const message =
      err.error || (json as { message?: string }).message || `HTTP ${res.status}`;

    if (typeof window !== "undefined" && res.status === 401) {
      removeToken();
      if (!window.location.pathname.startsWith("/painel/login")) {
        window.location.href = "/painel/login";
      }
    }

    throw createApiClientError(message, res.status, err.details);
  }

  return json as T;
}
