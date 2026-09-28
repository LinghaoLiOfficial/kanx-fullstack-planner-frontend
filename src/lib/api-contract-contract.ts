export type ApiContractFieldDefinition = {
  key: string;
  chineseName: string;
  englishName: string;
  meaning: string;
};

export const apiContractFieldDefinitions = {
  api_contract: {
    key: "api_contract",
    chineseName: "API 契约",
    englishName: "api_contract",
    meaning: "前后端通信协议，包括路径、方法、请求、响应、错误和认证要求。",
  },
  api_base_path: {
    key: "api_base_path",
    chineseName: "API前缀",
    englishName: "api_base_path",
    meaning: "API 的统一基础路径，例如 `/api/v1`。",
  },
  api_resource_groups: {
    key: "api_resource_groups",
    chineseName: "API资源分组",
    englishName: "api_resource_groups",
    meaning: "按业务资源或领域对象组织的接口分组集合。",
  },
  api_resource_group: {
    key: "api_resource_group",
    chineseName: "组",
    englishName: "api_resource_group",
    meaning: "一个 API 资源分组对象。",
  },
  group_name: {
    key: "group_name",
    chineseName: "组名称",
    englishName: "group_name",
    meaning: "该 API 资源分组的名称。",
  },
  group_purpose: {
    key: "group_purpose",
    chineseName: "组功能",
    englishName: "group_purpose",
    meaning: "该 API 资源分组承担的业务能力说明。",
  },
  endpoints: {
    key: "endpoints",
    chineseName: "接口列表",
    englishName: "endpoints",
    meaning: "该资源分组下的接口集合。",
  },
  endpoint: {
    key: "endpoint",
    chineseName: "接口",
    englishName: "endpoint",
    meaning: "一个具体 API 接口定义。",
  },
  http_method: {
    key: "http_method",
    chineseName: "HTTP方法",
    englishName: "http_method",
    meaning: "接口使用的 HTTP 动作，例如 GET、POST、PATCH、DELETE。",
  },
  endpoint_path: {
    key: "endpoint_path",
    chineseName: "接口路径",
    englishName: "endpoint_path",
    meaning: "接口相对于 API 前缀的访问路径。",
  },
  endpoint_purpose: {
    key: "endpoint_purpose",
    chineseName: "接口功能",
    englishName: "endpoint_purpose",
    meaning: "该接口提供的业务能力和使用场景。",
  },
  requires_auth: {
    key: "requires_auth",
    chineseName: "是否需要登录",
    englishName: "requires_auth",
    meaning: "调用该接口是否必须具备已登录身份。",
  },
  request_schema: {
    key: "request_schema",
    chineseName: "请求结构",
    englishName: "request_schema",
    meaning: "接口请求参数、请求体字段和校验规则。",
  },
  response_schema: {
    key: "response_schema",
    chineseName: "响应结构",
    englishName: "response_schema",
    meaning: "接口成功响应的数据结构和字段说明。",
  },
  error_model: {
    key: "error_model",
    chineseName: "错误模式",
    englishName: "error_model",
    meaning: "接口可能返回的错误状态、错误码、错误信息和恢复建议。",
  },
  error_case: {
    key: "error_case",
    chineseName: "错误",
    englishName: "error_case",
    meaning: "一个可能的接口错误场景。",
  },
  error_status_code: {
    key: "error_status_code",
    chineseName: "错误状态",
    englishName: "status_code",
    meaning: "该错误场景对应的 HTTP 状态码。",
  },
  error_code: {
    key: "error_code",
    chineseName: "错误码",
    englishName: "error_code",
    meaning: "该错误场景的稳定机器可读错误码。",
  },
  error_message: {
    key: "error_message",
    chineseName: "错误信息",
    englishName: "error_message",
    meaning: "该错误场景返回给调用方的错误信息。",
  },
  recovery_suggestion: {
    key: "recovery_suggestion",
    chineseName: "恢复建议",
    englishName: "recovery_suggestion",
    meaning: "调用方或用户遇到该错误后的恢复建议。",
  },
} as const;

export const apiContractLegacySections = [
  { key: "resources", title: "资源列表与接口" },
  { key: "schemas", title: "请求 / 响应 Schema" },
  { key: "error_model", title: "错误模型" },
  { key: "frontend_consumers", title: "前端消费者" },
  { key: "backend_service_mappings", title: "后端服务映射" },
  { key: "diff", title: "版本差异" },
];
