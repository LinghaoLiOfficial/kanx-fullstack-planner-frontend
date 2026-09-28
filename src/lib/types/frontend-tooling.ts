import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type FrontendToolingContent = {
  dependencies?: unknown[];
  internal_utilities?: unknown[];
  install_commands?: string[];
  diff?: unknown;
  [key: string]: unknown;
};

export type FrontendTooling = VersionedDesignAsset<FrontendToolingContent>;
