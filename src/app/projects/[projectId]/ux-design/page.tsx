"use client";

import { DraftingCompass } from "lucide-react";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { UXDesignContentViewer } from "@/components/ux-design/UXDesignContentViewer";
import { listUXDesigns } from "@/lib/api/ux-designs";
import type { UXDesignContent } from "@/lib/types/ux-design";

export default function UXDesignPage() {
  const title = "UX用户体验设计";
  const emptyDescription = "暂无 UX 设计版本。执行包含 UX 影响层的敏捷业务需求后，系统会生成 UX 设计。";

  return (
    <VersionedAssetPage
      title={title}
      emptyDescription={emptyDescription}
      listAssets={listUXDesigns}
      titleIcon={DraftingCompass}
      versionListWidth="narrow"
      renderContent={(_asset, content) => (
        <UXDesignContentViewer content={content as UXDesignContent} />
      )}
    />
  );
}
