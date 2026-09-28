import { FileText } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { JsonViewer } from "@/components/common/JsonViewer";
import { ExportMarkdownButton } from "@/components/prompts/ExportMarkdownButton";
import { getRoleLabel } from "@/components/prompts/ContextPackList";
import { PromptTextViewer } from "@/components/prompts/PromptTextViewer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContextPack } from "@/lib/types/context-pack";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ContextPackViewer({ pack }: { pack: ContextPack | null }) {
  if (!pack) {
      return (
        <EmptyState
          icon={FileText}
          title="请选择一个 Context Pack"
          description="左侧列表展示当前项目生成的指令集合"
        />
      );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{pack.title}</CardTitle>
              <CardDescription>{pack.summary}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{getRoleLabel(pack.role)}</Badge>
              <Badge variant="outline">{pack.format}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>创建时间：{formatDate(pack.created_at)}</span>
          <ExportMarkdownButton contextPackId={pack.id} />
        </CardContent>
      </Card>
      <PromptTextViewer promptText={pack.prompt_text} />
      <JsonViewer data={pack.content} title="Context Pack JSON" />
    </div>
  );
}
