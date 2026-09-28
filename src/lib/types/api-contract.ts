import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type ApiContractDraft = {
  id: string;
  project_id: string;
  blueprint_id: string;
  version: number;
  is_current?: boolean;
  title: string;
  summary: string;
  base_path: string;
  content: ApiContractContent;
  created_at: string;
  updated_at: string;
};

export type VersionedApiContract = VersionedDesignAsset<ApiContractContent>;

export type ApiErrorCase = {
  status_code: number;
  error_code: string;
  error_message: string;
  recovery_suggestion?: string;
};

export type ApiEndpoint = {
  http_method: string;
  endpoint_path: string;
  endpoint_purpose: string;
  requires_auth: boolean;
  request_schema: Record<string, unknown>;
  response_schema: Record<string, unknown>;
  error_model: ApiErrorCase[];
};

export type ApiResourceGroup = {
  group_name: string;
  group_purpose: string;
  endpoints: ApiEndpoint[];
};

export type NewApiContractContent = {
  api_base_path: string;
  api_resource_groups: ApiResourceGroup[];
  notes?: string[];
  diff?: unknown;
  [key: string]: unknown;
};

export type LegacyApiContractContent = {
  base_path: string;
  resources: LegacyApiResource[];
  schemas: LegacyApiSchema[];
  error_model?: Record<string, unknown>;
  notes?: string[];
  diff?: unknown;
  [key: string]: unknown;
};

export type ApiContractContent = NewApiContractContent | LegacyApiContractContent;

export type LegacyApiResource = {
  name: string;
  description?: string;
  endpoints: LegacyApiEndpoint[];
};

export type LegacyApiEndpoint = {
  method: string;
  path: string;
  operation_id?: string;
  purpose?: string;
  request_body?: string | null;
  response_body?: string | null;
  auth_required?: boolean;
  errors?: string[];
};

export type LegacyApiSchema = {
  name: string;
  fields: LegacyApiSchemaField[];
};

export type LegacyApiSchemaField = {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
};

export function isNewApiContractContent(
  content: ApiContractContent
): content is NewApiContractContent {
  return "api_base_path" in content || "api_resource_groups" in content;
}
