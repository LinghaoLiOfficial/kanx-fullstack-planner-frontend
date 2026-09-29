"use client";

import { FieldDefinitionHeading } from "@/components/business-stories/BusinessRequirementFieldDefinition";
import { Badge } from "@/components/ui/badge";
import { businessRequirementFieldDefinitionByKey as fields } from "@/lib/business-story-contract";
import type { AgileRequirement } from "@/lib/types/requirement";

export const agilePriorityLabels = { critical: "紧急", high: "高", normal: "普通", low: "低" } as const;
export const agileStatusLabels = { draft: "草稿", needs_clarification: "待澄清", ready: "就绪", approved: "已批准", archived: "已归档" } as const;

const priorityColors = {
  critical: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
  high: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  normal: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300",
  low: "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300",
} as const;

export function AgilePriorityBadge({ priority }: { priority: AgileRequirement["asset"]["priority"] }) {
  return <Badge variant="outline" className={priorityColors[priority]}>{agilePriorityLabels[priority]}</Badge>;
}

function TextBlock({ children }: { children: React.ReactNode }) {
  return <div className="whitespace-pre-wrap break-words rounded-lg border border-border/60 bg-background/70 px-4 py-3 text-sm leading-7 text-muted-foreground">{children}</div>;
}

function ListSection({ title, values }: { title: string; values?: string[] }) {
  return <section className="space-y-2"><h4 className="text-sm font-medium">{title}</h4><TextBlock>{values?.length ? <ul className="list-disc space-y-1 pl-5">{values.map((value, index) => <li key={`${index}-${value}`}>{value}</li>)}</ul> : "暂无"}</TextBlock></section>;
}

export function AgileRequirementDetails({ requirement }: { requirement: AgileRequirement }) {
  const asset = requirement.asset;
  return <div className="min-w-0">
    <div className="mb-6 space-y-3">
      <div className="flex flex-wrap items-center gap-2"><h3 className="break-words text-lg font-semibold leading-7">{asset.name}</h3><AgilePriorityBadge priority={asset.priority} /><Badge variant="outline">{agileStatusLabels[requirement.status]}</Badge></div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span className="break-all font-mono">{requirement.requirement_key}</span><span>优先级置信度 {Math.round(asset.priority_confidence * 100)}%</span>{requirement.current_revision ? <span>版本 {requirement.current_revision}</span> : null}</div>
    </div>
    <div className="space-y-6">
      <section className="space-y-2"><FieldDefinitionHeading definition={fields.user_story} titleClassName="text-sm font-medium" /><TextBlock>{asset.user_story}</TextBlock></section>
      <section className="space-y-2"><h4 className="text-sm font-medium">业务目标</h4><TextBlock>{asset.business_goal}</TextBlock></section>
      <section className="space-y-2"><FieldDefinitionHeading definition={fields.impact_scope} titleClassName="text-sm font-medium" /><div className="grid gap-4 md:grid-cols-2"><ListSection title="业务域" values={asset.impact_scope?.business_domains} /><ListSection title="用户角色" values={asset.impact_scope?.user_roles} /><ListSection title="业务对象" values={asset.impact_scope?.business_objects} /><ListSection title="业务流程" values={asset.impact_scope?.workflows} /><ListSection title="未来资产类型" values={asset.impact_scope?.future_asset_types} /></div></section>
      <section className="space-y-2"><FieldDefinitionHeading definition={fields.business_scope} titleClassName="text-sm font-medium" /><div className="grid gap-4 md:grid-cols-2"><ListSection title="纳入范围" values={asset.business_scope?.included} /><ListSection title="排除范围" values={asset.business_scope?.excluded} /></div></section>
      <section className="space-y-2"><FieldDefinitionHeading definition={fields.execution_note} titleClassName="text-sm font-medium" /><TextBlock>{asset.execution_guidance?.objective || "暂无"}</TextBlock><div className="grid gap-4 md:grid-cols-2"><ListSection title="预期行为" values={asset.execution_guidance?.expected_behavior} /><ListSection title="业务规则" values={asset.execution_guidance?.business_rules} /><ListSection title="验证说明" values={asset.execution_guidance?.validation_notes} /></div><TextBlock>实施边界：{asset.execution_guidance?.implementation_boundary || "暂无"}</TextBlock></section>
      <section className="space-y-2"><FieldDefinitionHeading definition={fields.acceptance_criteria} titleClassName="text-sm font-medium" /><div className="space-y-3">{asset.acceptance_criteria?.length ? asset.acceptance_criteria.map((criterion) => <TextBlock key={criterion.id}><div className="space-y-1"><p><span className="font-medium text-foreground">Given</span> {criterion.given}</p><p><span className="font-medium text-foreground">When</span> {criterion.when}</p><p><span className="font-medium text-foreground">Then</span> {criterion.then}</p></div></TextBlock>) : <TextBlock>暂无</TextBlock>}</div></section>
      <div className="grid gap-4 md:grid-cols-2"><ListSection title="依赖" values={asset.dependencies} /><ListSection title="来源证据" values={asset.source_evidence} /></div>
      {asset.assumptions?.length ? <ListSection title="假设" values={asset.assumptions.map((item) => typeof item === "string" ? item : JSON.stringify(item))} /> : null}
      {asset.priority_reason ? <section className="space-y-2"><h4 className="text-sm font-medium">优先级依据</h4><TextBlock>{asset.priority_reason}</TextBlock></section> : null}
    </div>
  </div>;
}
