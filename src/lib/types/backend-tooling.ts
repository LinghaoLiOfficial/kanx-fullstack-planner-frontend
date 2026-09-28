import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type BackendToolingContent = {
  dependencies?: unknown[];
  external_services?: unknown[];
  environment_variables?: unknown[];
  internal_utilities?: unknown[];
  install_commands?: string[];
  risks?: string[];
  diff?: unknown;
  [key: string]: unknown;
};

export type BackendTooling = VersionedDesignAsset<BackendToolingContent>;
