import { ApiError } from "@/lib/api/client";

export type GenerationModuleName = "业务需求故事" | "蓝图" | "API 契约" | "数据库模型";

const networkErrorMessage = "无法连接后端服务，请确认 API 服务已启动并检查 NEXT_PUBLIC_API_BASE_URL";

const missingUpstreamMessages: Record<GenerationModuleName, string> = {
  业务需求故事: "请先在“用户需求”模块提交至少一条用户需求。",
  蓝图: "请先在“用户需求”模块提交需求。建议先生成或完善“业务需求池”，再生成蓝图。",
  "API 契约": "请先生成项目蓝图，再生成 API 契约。",
  数据库模型: "请先生成项目蓝图。建议先生成 API 契约，再生成数据库模型。",
};

function getDetailText(detail: unknown): string | null {
  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === "object" && item !== null && "msg" in item && typeof item.msg === "string") {
          return item.msg;
        }

        return typeof item === "string" ? item : JSON.stringify(item);
      })
      .filter(Boolean);

    return messages.length ? messages.join("；") : null;
  }

  if (typeof detail === "object" && detail !== null) {
    if ("detail" in detail) {
      const nestedDetail = getDetailText(detail.detail);

      if (nestedDetail) {
        return nestedDetail;
      }
    }

    if ("message" in detail && typeof detail.message === "string" && detail.message.trim()) {
      return detail.message;
    }
  }

  return null;
}

function getApiErrorDetail(error: ApiError) {
  return getDetailText(error.detail ?? error.details);
}

export function getGenerationErrorMessage(error: unknown, moduleName: GenerationModuleName) {
  if (error instanceof ApiError) {
    const detail = getApiErrorDetail(error);

    if (error.status === 0) {
      return networkErrorMessage;
    }

    if (error.status === 400) {
      return detail ?? missingUpstreamMessages[moduleName];
    }

    if (error.status === 404) {
      return detail ?? "项目不存在、上游资源不存在，或资源已被删除。";
    }

    if (error.status === 502) {
      const suggestion = "大模型生成服务调用失败。请检查后端 LLM_BASE_URL、LLM_MODEL、API Key 配置，或查看后端日志。";

      return detail ? `${detail} ${suggestion}` : suggestion;
    }

    if (error.status === 503) {
      return detail ?? "大模型服务未配置。请在后端配置 LLM_API_KEY、LLM_BASE_URL 和 LLM_MODEL 后重试。";
    }

    return detail ?? error.message;
  }

  return error instanceof Error ? error.message : `生成${moduleName}失败，请稍后重试。`;
}
