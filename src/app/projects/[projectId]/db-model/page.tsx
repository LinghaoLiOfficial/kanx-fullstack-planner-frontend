"use client";

import { Database } from "lucide-react";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { DatabaseModelContentViewer } from "@/components/db-model/DatabaseModelContentViewer";
import { useLanguage } from "@/components/language/language-provider";
import { listDbModels } from "@/lib/api/db-models";
import { createLegacySections } from "@/lib/i18n";
import type { DbModelContent } from "@/lib/types/db-model";

export default function DbModelPage() {
  const { t } = useLanguage();
  const page = t.designAssets.pages.databaseModel;

  return (
    <VersionedAssetPage
      title={page.title}
      emptyDescription={page.emptyDescription}
      listAssets={listDbModels}
      sections={createLegacySections(t.designAssets.legacySections, [
        { key: "database", labelKey: "databaseSettings" },
        { key: "entities", labelKey: "entities" },
        { key: "relationships", labelKey: "relationships" },
        { key: "indexes", labelKey: "indexes" },
        { key: "migration_notes", labelKey: "migrationNotes" },
        { key: "api_field_mappings", labelKey: "apiFieldMappings" },
        { key: "diff", labelKey: "diff" },
      ])}
      titleIcon={Database}
      versionListWidth="narrow"
      renderContent={(_asset, content) => (
        <DatabaseModelContentViewer content={content as DbModelContent} />
      )}
    />
  );
}
