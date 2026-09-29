"use client";

import { ListChecks, PanelTopOpen, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AgilePriorityBadge, AgileRequirementDetails } from "@/components/requirement/AgileRequirementDetails";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listAgileRequirements } from "@/lib/api/requirements";
import type { AgileRequirement } from "@/lib/types/requirement";

export default function BusinessRequirementsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [items, setItems] = useState<AgileRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [priority, setPriority] = useState("all");

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAgileRequirements(projectId, { signal });
      if (!signal?.aborted) setItems(data.filter((item) => item.asset));
    } catch (cause) {
      if (!signal?.aborted) setError(cause instanceof Error ? cause.message : "加载敏捷业务需求失败");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) void load(controller.signal);
    });
    return () => controller.abort();
  }, [load]);

  const filtered = useMemo(() => items.filter((item) =>
    (priority === "all" || item.asset.priority === priority) &&
    (!keyword.trim() || `${item.asset.name} ${item.asset.user_story} ${item.requirement_key}`.toLowerCase().includes(keyword.trim().toLowerCase()))
  ), [items, keyword, priority]);
  const selected = filtered.find((item) => item.requirement_key === selectedKey) ?? filtered[0];

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto pr-2 lg:overflow-hidden lg:pr-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">敏捷业务需求</h1>
        <Button type="button" variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={loading ? "size-4 animate-spin" : "size-4"} />刷新
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">优先级
          <Select value={priority} onValueChange={setPriority}><SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">全部</SelectItem><SelectItem value="critical">紧急</SelectItem><SelectItem value="high">高</SelectItem><SelectItem value="normal">普通</SelectItem><SelectItem value="low">低</SelectItem></SelectContent></Select>
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-muted-foreground">关键词
          <Input className="h-9 w-64 max-w-full" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索名称、用户故事" />
        </label>
      </div>
      <div className="grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="min-w-0 lg:flex lg:min-h-0 lg:flex-col">
          <CardHeader><CardTitle className="flex items-center gap-2"><ListChecks className="size-5 text-muted-foreground" />需求列表</CardTitle></CardHeader>
          <CardContent className="space-y-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            {!loading && !error && filtered.map((item) => <button key={item.requirement_key} type="button" onClick={() => setSelectedKey(item.requirement_key)} className={`flex w-full min-w-0 flex-col gap-2 rounded-lg border p-3 text-left transition-colors hover:border-primary/50 hover:bg-muted/40 ${selected?.requirement_key === item.requirement_key ? "border-primary bg-muted/50" : "border-border/60"}`}><span className="break-words text-sm font-medium leading-6">{item.asset.name}</span><span className="flex flex-wrap items-center gap-2"><AgilePriorityBadge priority={item.asset.priority} /><span className="break-all font-mono text-xs text-muted-foreground">{item.requirement_key}</span></span></button>)}
            {!loading && !error && !filtered.length ? <p className="text-sm text-muted-foreground">{items.length ? "没有匹配的需求" : "暂无敏捷业务需求"}</p> : null}
          </CardContent>
        </Card>
        <Card className="min-w-0 lg:flex lg:min-h-0 lg:flex-col">
          <CardHeader><CardTitle className="flex items-center gap-2"><PanelTopOpen className="size-5 text-muted-foreground" />需求详情</CardTitle></CardHeader>
          <CardContent className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            {loading ? <LoadingState label="正在加载敏捷业务需求..." /> : null}
            {!loading && error ? <ErrorState message={error} actionLabel="重新加载" onAction={() => void load()} /> : null}
            {!loading && !error && selected ? <AgileRequirementDetails key={selected.requirement_key} requirement={selected} /> : null}
            {!loading && !error && !selected ? <EmptyState icon={ListChecks} title={items.length ? "没有匹配的需求" : "当前项目还没有敏捷业务需求"} description={items.length ? undefined : "从原始需求生成业务故事后，会在这里展示当前有效的敏捷业务需求。"} /> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
