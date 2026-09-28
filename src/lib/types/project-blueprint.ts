import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type ProjectBlueprintContent = {
  project_overview?: unknown;
  current_product_scope?: unknown;
  business_capability_summary?: unknown;
  frontend_summary?: unknown;
  backend_summary?: unknown;
  architecture_notes?: unknown;
  risks?: string[];
  open_questions?: string[];
  [key: string]: unknown;
};

export type VersionedProjectBlueprint = VersionedDesignAsset<ProjectBlueprintContent>;
