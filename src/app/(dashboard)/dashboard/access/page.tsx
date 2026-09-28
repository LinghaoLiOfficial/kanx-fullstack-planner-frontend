import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccessPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>权限管理</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-7 text-muted-foreground">
        这里适合接入角色、菜单权限、操作权限与组织结构配置。
      </CardContent>
    </Card>
  );
}
