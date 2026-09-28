import { Users } from "lucide-react";

import { LoginForm } from "@/components/demo/login-form";
import { MembersTable } from "@/components/dashboard/members-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { overviewMetrics } from "@/features/dashboard/data";

export default function DashboardPage() {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Overview</CardTitle>
            <CardDescription>
              这里可以替换为你的统计卡片、图表、表格和业务工作区。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {overviewMetrics.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-border/60 bg-background/80 p-5"
              >
                <div className="text-sm text-muted-foreground">{item.label}</div>
                <div className="mt-3 text-2xl font-semibold">{item.value}</div>
                <p className="mt-2 text-sm text-muted-foreground">{item.hint}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>登录表单示例</CardTitle>
            <CardDescription>
              使用 React Hook Form + Zod 的轻量表单范式，可直接替换为真实登录逻辑。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>成员列表示例</CardTitle>
            <CardDescription>
              展示企业后台常见的表格 + 分页组合，方便继续扩展筛选器和批量操作。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MembersTable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>空状态示例</CardTitle>
            <CardDescription>
              用于首屏无数据、筛选结果为空和初始化引导等场景。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Users}
              title="当前还没有新成员待处理"
              description="这是 fullstack-forge-frontend 里可复用的一类状态组件，后续可以继续抽象更多变体。"
              action={<Button variant="outline">邀请成员</Button>}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
