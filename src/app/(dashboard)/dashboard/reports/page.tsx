import { FileSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>报表中心</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          icon={FileSearch}
          title="还没有生成任何报表"
          description="这是项目内置的标准空状态组件。你可以在这里放置首次引导、创建动作、筛选器重置和帮助链接。"
          action={<Button>创建第一份报表</Button>}
        />
      </CardContent>
    </Card>
  );
}
