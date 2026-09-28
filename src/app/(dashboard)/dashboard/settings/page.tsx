import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>系统设置</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-7 text-muted-foreground">
        这里适合放置偏好设置、通知开关、品牌配置和系统参数。
      </CardContent>
    </Card>
  );
}
