import type { FrontendImplementationContent } from "@/lib/types/frontend-implementation";
import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type FrontendPageStructureContent = FrontendImplementationContent;

export type FrontendPageStructure = VersionedDesignAsset<FrontendPageStructureContent>;
