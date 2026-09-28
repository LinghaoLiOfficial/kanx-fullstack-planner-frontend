"use client";

import { Code2 } from "lucide-react";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { BackendImplementationContentViewer } from "@/components/backend-implementation/BackendImplementationContentViewer";
import { useLanguage } from "@/components/language/language-provider";
import { listBackendImplementationVersions } from "@/lib/api/backend-service-designs";
import { createLegacySections } from "@/lib/i18n";
import type { BackendImplementationContent } from "@/lib/types/backend-implementation";

export default function BackendImplementationPage() {
  const { t } = useLanguage();
  const legacySections = createLegacySections(t.designAssets.legacySections, [
    { key: "version_summary", labelKey: "versionSummary" },
    { key: "services", labelKey: "services" },
    { key: "cross_cutting_rules", labelKey: "crossCuttingRules" },
    { key: "api_mappings", labelKey: "apiMappings" },
    { key: "database_mappings", labelKey: "databaseMappings" },
    { key: "dependencies", labelKey: "dependencies" },
    { key: "external_services", labelKey: "externalServices" },
    { key: "environment_variables", labelKey: "environmentVariables" },
    { key: "internal_utilities", labelKey: "internalUtilities" },
    { key: "install_commands", labelKey: "installCommands" },
    { key: "risks", labelKey: "risks" },
    { key: "diff", labelKey: "diff" },
  ]);

  return (
    <VersionedAssetPage
      title={t.designAssets.pages.backendImplementation.title}
      emptyDescription={t.designAssets.pages.backendImplementation.emptyDescription}
      listAssets={listBackendImplementationVersions}
      sections={legacySections}
      titleIcon={Code2}
      versionListWidth="narrow"
      renderContent={(_asset, content) => (
        <BackendImplementationContentViewer content={content as BackendImplementationContent} />
      )}
    />
  );
}
