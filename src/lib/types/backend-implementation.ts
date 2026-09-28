import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type BackendDirectoryEntry = {
  path: string;
  purpose: string;
};

export type BackendCodeLogicItem = {
  target: string;
  service_flow: string[];
  validation_logic: string[];
  transaction_handling: string[];
  error_handling: string[];
};

export type BackendUtilityClass = {
  name: string;
  purpose: string;
  usage: string[];
};

export type BackendLLMInteractionTemplate = {
  template_name: string;
  input_structure: string[];
  output_structure: string[];
  parsing_rules: string[];
};

export type BackendEnvironmentVariable = {
  name: string;
  purpose: string;
  required: boolean;
};

export type BackendDependency = {
  package_name: string;
  purpose: string;
  required: boolean;
};

export type NewBackendImplementationContent = {
  version_summary?: string;
  directory_structure?: BackendDirectoryEntry[];
  code_logic?: BackendCodeLogicItem[];
  utility_classes?: BackendUtilityClass[];
  llm_interaction_templates?: BackendLLMInteractionTemplate[];
  environment_variables?: BackendEnvironmentVariable[];
  dependencies?: BackendDependency[];
  diff?: unknown;
  [key: string]: unknown;
};

export type LegacyBackendImplementationContent = {
  version_summary?: string;
  service_design?: unknown;
  services?: unknown[];
  cross_cutting_rules?: unknown[];
  api_mappings?: unknown[];
  database_mappings?: unknown[];
  code_logic?: unknown;
  dependency_packages?: unknown[];
  external_services?: unknown[];
  environment_variables?: unknown;
  utility_modules?: unknown[];
  internal_utilities?: unknown[];
  install_commands?: string[];
  risks?: string[];
  notes?: string[];
  diff?: unknown;
  [key: string]: unknown;
};

export type BackendImplementationContent =
  | NewBackendImplementationContent
  | LegacyBackendImplementationContent;

export type BackendImplementation = VersionedDesignAsset<BackendImplementationContent>;

export function isNewBackendImplementationContent(
  content: BackendImplementationContent
): content is NewBackendImplementationContent {
  return (
    "directory_structure" in content ||
    "utility_classes" in content ||
    "llm_interaction_templates" in content ||
    ("code_logic" in content && !("services" in content) && !("internal_utilities" in content)) ||
    ("dependencies" in content && !("external_services" in content))
  );
}
