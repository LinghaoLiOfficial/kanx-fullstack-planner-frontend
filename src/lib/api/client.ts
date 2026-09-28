import { env } from "@/lib/env";
import { redirectToLoginRequired } from "@/lib/auth/login-required";

export class ApiError extends Error {
  status: number;
  detail?: unknown;
  details?: unknown;

  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
    this.details = detail;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
  query?: Record<string, string | number | boolean | undefined | null>;
  redirectOnUnauthorized?: boolean;
};

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const base = path.startsWith("/api") ? env.NEXT_PUBLIC_APP_URL : env.NEXT_PUBLIC_API_BASE_URL;
  const url = new URL(joinUrl(base, path));

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (typeof payload === "object" && payload !== null) {
    if ("message" in payload && typeof payload.message === "string") {
      return payload.message;
    }

    if ("detail" in payload) {
      if (typeof payload.detail === "string") {
        return payload.detail;
      }

      if (Array.isArray(payload.detail)) {
        return payload.detail
          .map((item) => {
            if (typeof item === "object" && item !== null && "msg" in item && typeof item.msg === "string") {
              return item.msg;
            }

            return JSON.stringify(item);
          })
          .join("；");
      }
    }
  }

  return fallback;
}

export async function apiRequest<T>(
  path: string,
  { body, headers, query, redirectOnUnauthorized = true, ...init }: RequestOptions = {}
) {
  let response: Response;

  try {
    response = await fetch(buildUrl(path, query), {
      ...init,
      credentials: init.credentials ?? "include",
      headers: {
        ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body:
        body && typeof body === "object" && !(body instanceof FormData)
          ? JSON.stringify(body)
          : body,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new ApiError(
      "无法连接后端服务，请确认 API 服务已启动并检查 NEXT_PUBLIC_API_BASE_URL",
      0,
      error
    );
  }

  if (!response.ok) {
    const text = await response.text();
    let payload: unknown = text;

    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = text;
    }

    if (response.status === 401 && redirectOnUnauthorized) {
      redirectToLoginRequired();
    }

    throw new ApiError(
      getErrorMessage(payload, text || `Request failed with status ${response.status}`),
      response.status,
      payload
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  if (response.headers.get("content-type")?.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}
