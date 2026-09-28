"use client";

import { Palette } from "lucide-react";

import { VersionedAssetPage } from "@/components/design-assets/VersionedAssetPage";
import { UIDesignContentViewer } from "@/components/ui-design/UIDesignContentViewer";
import { listUIDesigns } from "@/lib/api/ui-designs";
import type { UIDesignContent } from "@/lib/types/ui-design";

export default function UIDesignPage() {
  const title = "UI视觉设计";
  const emptyDescription = "暂无 UI 设计版本。执行包含 UI 影响层的敏捷业务需求后，系统会生成 UI 设计。";

  return (
    <VersionedAssetPage
      title={title}
      emptyDescription={emptyDescription}
      listAssets={listUIDesigns}
      titleIcon={Palette}
      versionListWidth="narrow"
      renderContent={(_asset, content) => (
        <UIDesignContentViewer content={content as UIDesignContent} />
      )}
    />
  );
}
