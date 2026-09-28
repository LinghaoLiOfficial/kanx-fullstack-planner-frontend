"use client";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { useLanguage } from "@/components/language/language-provider";
import { listBackendServiceDesigns } from "@/lib/api/backend-service-designs";

export default function BackendServicesPage() {
  const { t } = useLanguage();
  const page = t.designAssets.pages.backendServices;

  return (
    <VersionedAssetPage
      title={page.title}
      description={page.description}
      emptyDescription={page.emptyDescription}
      listAssets={listBackendServiceDesigns}
      sections={[
        { key: "services", title: t.designAssets.legacySections.services },
        { key: "cross_cutting_rules", title: t.designAssets.legacySections.crossCuttingRules },
        { key: "api_mappings", title: t.designAssets.legacySections.apiMappings },
        { key: "database_mappings", title: t.designAssets.legacySections.databaseMappings },
        { key: "diff", title: t.designAssets.legacySections.diff },
      ]}
    />
  );
}
