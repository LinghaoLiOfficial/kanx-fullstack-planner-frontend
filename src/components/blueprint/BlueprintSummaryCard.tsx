import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectBlueprint } from "@/lib/types/blueprint";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function BlueprintSummaryCard({ blueprint }: { blueprint: ProjectBlueprint }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{blueprint.title}</CardTitle>
            <CardDescription>{blueprint.summary}</CardDescription>
          </div>
          <Badge>v{blueprint.version}</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        创建时间：{formatDate(blueprint.created_at)}
      </CardContent>
    </Card>
  );
}
