"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { AppShell } from "@/components/layout/AppShell";
import { useLanguage } from "@/components/language/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { getAdminLLMTask, listAdminLLMTasks } from "@/lib/api/admin";
import type { AdminLLMTask, AdminLLMTaskDetail, AdminLLMTaskPage } from "@/lib/types/admin-llm-task";

const PAGE_SIZE = 20;
const REFRESH_MS = 3_000;

function JsonBlock({ value }: { value: unknown }) {
  return <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded border bg-muted/40 p-3 text-xs leading-5">{typeof value === "string" ? value : JSON.stringify(value, null, 2)}</pre>;
}

function Monitor() {
  const { t, locale } = useLanguage();
  const labels = t.adminLLMTasks;
  const [draftUser, setDraftUser] = useState("");
  const [draftProject, setDraftProject] = useState("");
  const [draftStatus, setDraftStatus] = useState("");
  const [filters, setFilters] = useState({ user_id: "", project_id: "", status: "" });
  const [page, setPage] = useState(1);
  const [listing, setListing] = useState<AdminLLMTaskPage | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminLLMTaskDetail | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const stamp = (value: string | null) => value ? new Date(value).toLocaleString(locale) : labels.missing;
  const stateLabel = (value: string) => labels.statuses[value as keyof typeof labels.statuses] ?? value;
  const stageLabel = (value: string) => labels.stageNames[value as keyof typeof labels.stageNames] ?? value;

  useEffect(() => {
    const controller = new AbortController();
    let busy = false;
    const load = async () => {
      if (document.hidden || busy) return;
      busy = true;
      try {
        const result = await listAdminLLMTasks({
          user_id: filters.user_id || undefined,
          project_id: filters.project_id || undefined,
          status: filters.status || undefined,
          page,
          page_size: PAGE_SIZE,
        }, controller.signal);
        if (!controller.signal.aborted) { setListing(result); setError(null); }
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : labels.failed);
      } finally { busy = false; }
    };
    void load();
    const timer = window.setInterval(() => void load(), REFRESH_MS);
    document.addEventListener("visibilitychange", load);
    return () => { controller.abort(); window.clearInterval(timer); document.removeEventListener("visibilitychange", load); };
  }, [filters, page, refresh, labels.failed]);

  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    let busy = false;
    const load = async () => {
      if (document.hidden || busy) return;
      busy = true;
      try {
        const result = await getAdminLLMTask(selected, controller.signal);
        if (!controller.signal.aborted) { setDetail(result); setDetailError(null); }
      } catch (cause) {
        if (!controller.signal.aborted) setDetailError(cause instanceof Error ? cause.message : labels.failed);
      } finally { busy = false; }
    };
    void load();
    const timer = window.setInterval(() => void load(), REFRESH_MS);
    document.addEventListener("visibilitychange", load);
    return () => { controller.abort(); window.clearInterval(timer); document.removeEventListener("visibilitychange", load); };
  }, [selected, refresh, labels.failed]);

  const open = useCallback((item: AdminLLMTask) => {
    setSelected(item.id);
    setDetail(null);
    setDetailError(null);
    setRevealed({});
  }, []);

  return (
    <AppShell>
      <section className="min-w-0 space-y-5 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="flex items-center gap-2 text-2xl font-semibold"><Activity className="size-6" />{labels.title}</h1>
          <Button variant="outline" onClick={() => setRefresh((n) => n + 1)}><RefreshCw className="size-4" />{labels.refresh}</Button>
        </div>
        <form className="flex flex-wrap items-end gap-3 border-b pb-4" onSubmit={(event) => {
          event.preventDefault(); setPage(1);
          setFilters({ user_id: draftUser.trim(), project_id: draftProject.trim(), status: draftStatus });
        }}>
          <label className="grid min-w-40 flex-1 gap-1 text-sm">{labels.user}<Input value={draftUser} onChange={(event) => setDraftUser(event.target.value)} /></label>
          <label className="grid min-w-40 flex-1 gap-1 text-sm">{labels.project}<Input value={draftProject} onChange={(event) => setDraftProject(event.target.value)} /></label>
          <label className="grid min-w-36 gap-1 text-sm">{labels.status}
            <select className="h-9 rounded-md border bg-background px-2" value={draftStatus} onChange={(event) => setDraftStatus(event.target.value)}>
              <option value="">{labels.all}</option>
              {(["queued", "running", "succeeded", "needs_clarification", "failed", "cancelled"] as const).map((value) => <option key={value} value={value}>{stateLabel(value)}</option>)}
            </select>
          </label>
          <Button type="submit">{labels.apply}</Button>
        </form>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <div className="overflow-x-auto border-y">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground"><tr>
              <th className="p-3 font-medium">{labels.task}</th><th className="p-3 font-medium">{labels.user}</th>
              <th className="p-3 font-medium">{labels.status}</th><th className="p-3 font-medium">{labels.progress}</th>
              <th className="p-3 font-medium">{labels.created}</th><th className="p-3 font-medium">{labels.updated}</th><th className="p-3" />
            </tr></thead>
            <tbody>
              {listing?.items.map((item) => <tr key={item.id} className="border-t align-middle">
                <td className="max-w-52 p-3"><span className="block truncate font-medium" title={item.project_name}>{item.project_name}</span><span className="block truncate font-mono text-xs text-muted-foreground" title={item.id}>{item.id}</span></td>
                <td className="p-3"><span className="block">{item.username}</span><span className="font-mono text-xs text-muted-foreground">{item.user_id.slice(0, 8)}</span></td>
                <td className="p-3"><Badge variant="outline">{stateLabel(item.status)}</Badge></td>
                <td className="w-36 p-3"><span className="tabular-nums">{item.progress}% · {item.completed_steps}/{item.total_steps}</span><div className="mt-1 h-1.5 rounded bg-muted"><div className="h-full rounded bg-emerald-600" style={{ width: `${item.progress}%` }} /></div></td>
                <td className="whitespace-nowrap p-3">{stamp(item.created_at)}</td><td className="whitespace-nowrap p-3">{stamp(item.updated_at)}</td>
                <td className="p-3"><Button size="sm" variant="outline" onClick={() => open(item)}>{labels.details}</Button></td>
              </tr>)}
            </tbody>
          </table>
          {!listing && !error && <p className="p-6 text-sm text-muted-foreground">{labels.loading}</p>}
          {listing?.items.length === 0 && <p className="p-6 text-sm text-muted-foreground">{labels.empty}</p>}
        </div>
        {listing && <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
          <span>{labels.page(listing.page, listing.total)}</span>
          <Button variant="outline" size="icon" title={t.common.previousPage} aria-label={t.common.previousPage} disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="size-4" /></Button>
          <Button variant="outline" size="icon" title={t.common.nextPage} aria-label={t.common.nextPage} disabled={page * PAGE_SIZE >= listing.total} onClick={() => setPage(page + 1)}><ChevronRight className="size-4" /></Button>
        </div>}
      </section>
      <Sheet open={selected !== null} onOpenChange={(value) => { if (!value) { setSelected(null); setDetail(null); } }}>
        <SheetContent className="max-w-none overflow-y-auto sm:max-w-3xl" aria-describedby="task-description">
          <SheetHeader><SheetTitle>{labels.details}</SheetTitle><SheetDescription id="task-description">{detail?.id ?? selected}</SheetDescription></SheetHeader>
          {detailError && <p role="alert" className="text-sm text-destructive">{detailError}</p>}
          {!detail && !detailError && <p>{labels.loading}</p>}
          {detail && <div className="space-y-6 pb-8 text-sm">
            <div className="flex flex-wrap gap-3 border-b pb-3"><strong>{detail.username} · {detail.project_name}</strong><Badge variant="outline">{stateLabel(detail.status)}</Badge><span>{detail.progress}%</span><span>{stamp(detail.updated_at)}</span></div>
            {detail.error && <p className="break-words text-destructive">{detail.error}</p>}
            <section><h2 className="mb-2 font-semibold">{labels.stages}</h2><ol className="divide-y border-y">{detail.steps.map((step) => <li key={step.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2"><span className="min-w-44 font-medium">{stageLabel(step.key)}</span><Badge variant="outline">{stateLabel(step.status)}</Badge><span className="text-muted-foreground">{step.started_at ? `${stamp(step.started_at)} - ${stamp(step.finished_at)}` : labels.missing}</span>{step.error && <span className="w-full break-words text-destructive">{step.error}</span>}</li>)}</ol></section>
            <section><h2 className="mb-2 font-semibold">{labels.calls} ({detail.invocations.length})</h2><p className="mb-2 text-xs text-muted-foreground">{labels.providerRetries}</p>
              <div className="divide-y border-y">{detail.invocations.map((item) => <div key={item.id} className="space-y-2 py-3">
                <div className="flex flex-wrap items-center gap-2"><strong>{stageLabel(item.task_name)}{item.subject?.label ? ` · ${item.subject.label}` : ""}</strong><Badge variant="outline">{stateLabel(item.status)}</Badge><span>#{item.call_index ?? labels.missing} · {labels.attempt} {item.attempt}/{item.max_attempts ?? labels.missing}</span></div>
                <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground"><span>{item.model}</span><span>{item.latency_ms === null ? labels.missing : `${item.latency_ms} ms`}</span><span>{stamp(item.created_at)}</span><span>{item.call_type ?? labels.missing}</span></div>
                {item.error && <p className="break-words text-destructive">{item.error}</p>}
                <Button size="sm" variant="outline" onClick={() => setRevealed((current) => ({ ...current, [item.id]: !current[item.id] }))}>{revealed[item.id] ? labels.collapse : labels.inspect}</Button>
                {revealed[item.id] && <div className="grid min-w-0 gap-3 md:grid-cols-2">
                  {([[labels.businessInput, item.input], [labels.output, item.output], [labels.control, item.control], [labels.systemPrompt, item.system_prompt], [labels.userPrompt, item.user_prompt], [labels.audit, { invocation_id: item.invocation_id, input_hash: item.input_hash, output_hash: item.output_hash, started_at: item.created_at, finished_at: item.finished_at, attempt: item.attempt, status: item.status }]] as Array<[string, unknown]>).map(([name, value]) => <div className="min-w-0" key={name}><h3 className="mb-1 font-medium">{name}</h3><JsonBlock value={value ?? labels.missing} /></div>)}
                </div>}
              </div>)}</div>
            </section>
            <section><h2 className="mb-2 font-semibold">{labels.gate}</h2>{detail.findings.length ? detail.findings.map((finding, index) => <p key={`${finding.code}-${index}`} className="mb-1 break-words">{finding.severity} · {finding.code}: {finding.message}</p>) : <p className="text-muted-foreground">{labels.empty}</p>}</section>
            <details className="border-t pt-3"><summary className="cursor-pointer font-medium">{labels.input} / {labels.context}</summary><div className="mt-3 grid gap-3 md:grid-cols-2"><JsonBlock value={detail.raw_text} /><JsonBlock value={detail.project_context} /></div></details>
          </div>}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}

export default function AdminLLMTasksPage() {
  return <RequireAdmin><Monitor /></RequireAdmin>;
}
