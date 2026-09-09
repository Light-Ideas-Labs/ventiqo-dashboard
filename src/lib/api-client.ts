import { getSession } from "next-auth/react";
import { VentiqoBackendAPI } from "@/constants/ventiqo-backend-api";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean; // attach the session access token — defaults to true
}

// Session lookups happen on every authed call, but NextAuth's own
// getSession()/session-endpoint response is what refreshes an expired
// access token (see the jwt() callback in auth.config.ts), so this also
// doubles as the refresh trigger.
async function getAccessToken(): Promise<string | undefined> {
  const session = await getSession();
  return session?.accessToken ?? undefined;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth = true, body, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new ApiError("No access token found. Please login again.", 401);
    }
    finalHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${VentiqoBackendAPI}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : undefined;

  if (!res.ok) {
    throw new ApiError(data?.message || res.statusText || "Request failed", res.status, data);
  }

  return data as T;
}
