import { FileJson } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { JsonViewer } from "@/components/common/JsonViewer";
import { BlueprintSummaryCard } from "@/components/blueprint/BlueprintSummaryCard";
import type { ProjectBlueprint } from "@/lib/types/blueprint";

type BlueprintViewerProps = {
  blueprint: ProjectBlueprint | null;
};

export function BlueprintViewer({ blueprint }: BlueprintViewerProps) {
  if (!blueprint) {
    return (
      <EmptyState
        icon={FileJson}
        title="当前项目还没有 blueprint"
        description="保存至少一条用户需求后，点击“生成蓝图”查看由大模型生成的 Project Blueprint JSON"
      />
    );
  }

  return (
    <div className="space-y-4">
      <BlueprintSummaryCard blueprint={blueprint} />
      <JsonViewer data={blueprint.content} title="Project Blueprint JSON" />
    </div>
  );
}
