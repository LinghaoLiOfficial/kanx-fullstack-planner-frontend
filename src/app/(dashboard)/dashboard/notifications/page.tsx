import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>通知中心</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-7 text-muted-foreground">
        这里适合放置系统通知、站内信、异步任务状态和用户提醒中心。
      </CardContent>
    </Card>
  );
}
