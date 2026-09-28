"use client";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { useLanguage } from "@/components/language/language-provider";
import { listBackendToolings } from "@/lib/api/backend-toolings";

export default function BackendToolsPage() {
  const { t } = useLanguage();
  const page = t.designAssets.pages.backendTools;

  return (
    <VersionedAssetPage
      title={page.title}
      description={page.description}
      emptyDescription={page.emptyDescription}
      listAssets={listBackendToolings}
      sections={[
        { key: "dependencies", title: t.designAssets.legacySections.dependencies },
        { key: "external_services", title: t.designAssets.legacySections.externalServices },
        { key: "environment_variables", title: t.designAssets.legacySections.environmentVariables },
        { key: "internal_utilities", title: t.designAssets.legacySections.internalUtilities },
        { key: "install_commands", title: t.designAssets.legacySections.installCommands },
        { key: "risks", title: t.designAssets.legacySections.risks },
      ]}
    />
  );
}
