"use client";

import { Braces } from "lucide-react";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { ApiContractContentViewer } from "@/components/contract/ApiContractContentViewer";
import { useLanguage } from "@/components/language/language-provider";
import { listApiContracts } from "@/lib/api/api-contracts";
import { createLegacySections } from "@/lib/i18n";
import type { ApiContractDraft } from "@/lib/types/api-contract";

export default function ApiContractPage() {
  const { t } = useLanguage();
  const legacySections = createLegacySections(t.designAssets.legacySections, [
    { key: "resources", labelKey: "resources" },
    { key: "schemas", labelKey: "schemas" },
    { key: "error_model", labelKey: "errorModel" },
    { key: "frontend_consumers", labelKey: "frontendConsumers" },
    { key: "backend_service_mappings", labelKey: "backendServiceMappings" },
    { key: "diff", labelKey: "diff" },
  ]);

  return (
    <VersionedAssetPage
      title={t.designAssets.pages.apiContract.title}
      emptyDescription={t.designAssets.pages.apiContract.emptyDescription}
      listAssets={listApiContracts}
      sections={legacySections}
      titleIcon={Braces}
      versionListWidth="narrow"
      renderContent={(asset) => (
        <ApiContractContentViewer contract={asset as ApiContractDraft} />
      )}
    />
  );
}
