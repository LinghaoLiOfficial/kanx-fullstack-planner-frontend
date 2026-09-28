"use client";

import Link from "next/link";
import { FileJson, ListChecks, Settings, Workflow } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  {
    icon: Settings,
    title: "查看项目配置",
    description: "查看项目名称、描述、结构化技术项和全局约束。",
    href: "configuration",
    buttonLabel: "打开项目配置",
  },
  {
    icon: ListChecks,
    title: "进入敏捷业务需求池",
    description: "录入原始需求并整理成当前有效的敏捷业务需求池。",
    href: "business-requirements",
    buttonLabel: "查看敏捷业务需求池",
  },
  {
    icon: FileJson,
    title: "查看版本资产",
    description: "查看 UX、UI、前端实现、API 契约、后端实现与数据库模型。",
    href: "frontend-implementation",
    buttonLabel: "打开版本资产",
  },
  {
    icon: Workflow,
    title: "查看指令集合",
    description: "查看当前有效的指令集合、验收清单和历史版本。",
    href: "delivery",
    buttonLabel: "查看指令集合",
  },
];

export function GenerationActionPanel({
  projectId,
  hasCurrentStoryPool,
  hasCurrentChangeSet,
  hasPromptPack,
  isTechStackConfigured,
}: {
  projectId: string;
  hasCurrentStoryPool: boolean;
  hasCurrentChangeSet: boolean;
  hasPromptPack: boolean;
  isTechStackConfigured: boolean;
  onGenerated?: () => Promise<void> | void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>主流程入口</CardTitle>
            <CardDescription>从敏捷业务需求池、分层变更集到版本资产和指令集合的主链路</CardDescription>
          </div>
          <Badge variant="outline">
            {hasPromptPack
              ? "指令集合就绪"
              : hasCurrentChangeSet
                ? "变更集待消耗"
                : hasCurrentStoryPool
                  ? "敏捷业务需求池就绪"
                  : "待启动"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {!isTechStackConfigured ? (
          <div className="md:col-span-2">
            <EmptyState
              icon={FileJson}
              title="先生成配置"
              description="项目进入编排流程前需要先有可用的结构化技术栈配置"
              action={
                <Button asChild variant="outline">
                  <Link href={`/projects/${projectId}/configuration`}>配置项目</Link>
                </Button>
              }
            />
          </div>
        ) : null}
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <div key={action.href} className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-9 items-center justify-center rounded-full bg-secondary">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{action.description}</p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/projects/${projectId}/${action.href}`}>{action.buttonLabel}</Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
