import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type BackendServiceDesignContent = {
  services?: unknown[];
  cross_cutting_rules?: unknown[];
  diff?: unknown;
  [key: string]: unknown;
};

export type BackendServiceDesign = VersionedDesignAsset<BackendServiceDesignContent>;
