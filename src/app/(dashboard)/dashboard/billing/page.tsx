import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>账单中心</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-7 text-muted-foreground">
        这里适合放置订阅方案、发票记录、额度使用和支付方式管理。
      </CardContent>
    </Card>
  );
}
