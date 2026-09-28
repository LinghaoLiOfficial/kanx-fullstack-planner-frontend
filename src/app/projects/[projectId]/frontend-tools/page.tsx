"use client";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { useLanguage } from "@/components/language/language-provider";
import { listFrontendToolings } from "@/lib/api/frontend-toolings";

export default function FrontendToolsPage() {
  const { t } = useLanguage();
  const page = t.designAssets.pages.frontendTools;

  return (
    <VersionedAssetPage
      title={page.title}
      description={page.description}
      emptyDescription={page.emptyDescription}
      listAssets={listFrontendToolings}
      sections={[
        { key: "dependencies", title: t.designAssets.legacySections.dependencies },
        { key: "internal_utilities", title: t.designAssets.legacySections.internalUtilities },
        { key: "install_commands", title: t.designAssets.legacySections.installCommands },
        { key: "diff", title: t.designAssets.legacySections.diff },
      ]}
    />
  );
}
