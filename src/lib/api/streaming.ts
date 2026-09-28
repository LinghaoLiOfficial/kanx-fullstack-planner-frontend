import { ApiError } from "@/lib/api/client";
import { env } from "@/lib/env";
import type { StreamEvent } from "@/lib/types/streaming";

type StreamPostOptions<TBody> = {
  path: string;
  body?: TBody;
  onEvent: (event: StreamEvent) => void;
  signal?: AbortSignal;
};

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
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

function isStreamEvent(value: unknown): value is StreamEvent {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typeof value.type === "string" &&
    "module" in value &&
    typeof value.module === "string"
  );
}

export function parseSseEventBlock(block: string): StreamEvent | null {
  const data = block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .join("\n");

  if (!data || data === "[DONE]") {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(data);
  } catch {
    return {
      type: "error",
      module: "blueprint",
      code: "invalid_stream_event",
      message: "流式响应解析失败，请检查后端 SSE data JSON 格式。",
    };
  }

  if (!isStreamEvent(parsed)) {
    return {
      type: "error",
      module: "blueprint",
      code: "invalid_stream_event",
      message: "流式响应事件格式无效。",
    };
  }

  return parsed;
}

async function readErrorResponse(response: Response) {
  const text = await response.text();
  let payload: unknown = text;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  throw new ApiError(
    getErrorMessage(payload, text || `Request failed with status ${response.status}`),
    response.status,
    payload
  );
}

export async function streamPost<TBody>({
  path,
  body,
  onEvent,
  signal,
}: StreamPostOptions<TBody>): Promise<void> {
  let response: Response;

  try {
    response = await fetch(joinUrl(env.NEXT_PUBLIC_API_BASE_URL, path), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
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
    await readErrorResponse(response);
  }

  if (!response.body) {
    throw new ApiError("后端未返回可读取的流式响应。", response.status, null);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split(/\r?\n\r?\n/);
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const event = parseSseEventBlock(part);

        if (event) {
          onEvent(event);
        }
      }
    }

    buffer += decoder.decode();

    if (buffer.trim()) {
      const event = parseSseEventBlock(buffer);

      if (event) {
        onEvent(event);
      }
    }
  } finally {
    reader.releaseLock();
  }
}
