"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Diff, PanelTopOpen, ServerCog } from "lucide-react";

import { CopyButton } from "@/components/common/CopyButton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { sortAssetsByVersion, VersionList } from "@/components/design-assets/VersionList";
import { useLanguage } from "@/components/language/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listPromptPacks } from "@/lib/api/prompt-packs";
import { isAbortError, useInFlightRef, useMountedRef } from "@/lib/async-control";
import { formatDateTime } from "@/lib/design-asset-labels";
import type { I18nDictionary } from "@/lib/i18n";
import type { PromptBlock as PromptBlockType, PromptPack } from "@/lib/types/prompt-pack";

const PROJECT_REFRESH_INTERVAL_MS = 3000;

function textFromUnknown(value: unknown): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => textFromUnknown(item))
      .filter(Boolean)
      .join("\n");
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function splitSummaryText(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return [];
  }

  const lines = trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return lines;
  }

  return trimmed
    .split(/(?<=[。；;])\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSummaryItems(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => textFromUnknown(item)).flatMap(splitSummaryText);
  }

  return splitSummaryText(textFromUnknown(value));
}

function formatDiffLabel(key: string, labels: I18nDictionary["promptPack"]["diffLabels"]) {
  return labels[key as keyof typeof labels] ?? key.replaceAll("_", " ");
}

function DiffSummaryPanel({ summary }: { summary: unknown }) {
  const { t } = useLanguage();

  if (!summary) {
    return (
      <section className="rounded-2xl border border-border/60 bg-muted/20 p-4">
        <h3 className="flex items-center gap-2 text-sm font-medium">
          <Diff className="size-5 text-muted-foreground" aria-hidden="true" />
          {t.promptPack.diffSummary}
        </h3>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{t.promptPack.noDiffSummary}</p>
      </section>
    );
  }

  if (isRecord(summary)) {
    const groups = Object.entries(summary)
      .map(([key, value]) => ({
        key,
        label: formatDiffLabel(key, t.promptPack.diffLabels),
        items: normalizeSummaryItems(value),
      }))
      .filter((group) => group.items.length > 0);

    if (groups.length > 0) {
      return (
        <section className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <Diff className="size-5 text-muted-foreground" aria-hidden="true" />
            {t.promptPack.diffSummary}
          </h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {groups.map((group) => (
              <div key={group.key} className="rounded-2xl border border-border/60 bg-background p-4">
                <div className="text-xs font-medium text-muted-foreground">{group.label}</div>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item, index) => (
                    <li key={index} className="flex gap-2 text-sm leading-7 text-foreground">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span className="min-w-0 whitespace-pre-wrap break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      );
    }
  }

  const items = normalizeSummaryItems(summary);

  return (
    <section className="rounded-2xl border border-border/60 bg-muted/20 p-4">
      <h3 className="flex items-center gap-2 text-sm font-medium">
        <Diff className="size-5 text-muted-foreground" aria-hidden="true" />
        {t.promptPack.diffSummary}
      </h3>
      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li key={index} className="rounded-2xl border border-border/60 bg-background p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </div>
                <p className="min-w-0 whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{item}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{t.promptPack.noDiffSummary}</p>
      )}
    </section>
  );
}

function PromptList({ title, items }: { title: string; items?: unknown[] }) {
  const { t } = useLanguage();
  const normalizedItems = normalizePromptListItems(items);

  return (
    <section className="rounded-2xl border border-border/60 p-4">
      <h3 className="text-sm font-medium">{title}</h3>
      {normalizedItems.length ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          {normalizedItems.map((item, index) => (
            <li key={index} className="whitespace-pre-wrap break-words">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{t.promptPack.noItems}</p>
      )}
    </section>
  );
}

function normalizePromptListItems(items?: unknown[]) {
  return Array.isArray(items)
    ? items.map((item) => textFromUnknown(item)).filter(Boolean)
    : [];
}

function formatPromptListSection(title: string, items: unknown[] | undefined, emptyLabel: string) {
  const normalizedItems = normalizePromptListItems(items);

  if (normalizedItems.length === 0) {
    return `## ${title}\n${emptyLabel}`;
  }

  return [`## ${title}`, ...normalizedItems.map((item) => `- ${item}`)].join("\n");
}

function buildCopyablePrompt(title: string, prompt: PromptBlockType, body: string, labels: I18nDictionary["promptPack"]) {
  const formattedBody = formatPromptBodyForCopy(body);

  return [
    `# ${title}`,
    prompt.title ?? "",
    formattedBody,
    formatPromptListSection(labels.affectedFiles, prompt.affected_files, labels.noItems),
    formatPromptListSection(labels.doNotModify, prompt.do_not_modify, labels.noItems),
    formatPromptListSection(labels.verificationSteps, prompt.verification_steps, labels.noItems),
  ]
    .filter((section) => section.trim().length > 0)
    .join("\n\n");
}

function formatPromptBodyForCopy(body: string) {
  const trimmedBody = body.trim();

  if (!trimmedBody) {
    return "";
  }

  const parsed = parsePromptSteps(trimmedBody);

  if (parsed.steps.length === 0) {
    return trimmedBody;
  }

  return [
    parsed.lead,
    ...parsed.steps.map((step) => `${step.number}. ${step.text}`),
  ]
    .filter(Boolean)
    .join("\n\n");
}

function parsePromptSteps(body: string) {
  const normalizedBody = body.replace(/([^\n])\s*(?=\d+\.\s)/g, "$1\n");
  const lines = normalizedBody.split("\n");
  const stepStartPattern = /^(\d+)\.\s*(.+)$/;
  const steps: Array<{ number: string; text: string }> = [];
  const leadLines: string[] = [];
  let currentStep: { number: string; text: string[] } | null = null;
  let sawFirstStep = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const match = line.match(stepStartPattern);

    if (match) {
      sawFirstStep = true;
      if (currentStep) {
        steps.push({ number: currentStep.number, text: currentStep.text.join("\n").trim() });
      }
      currentStep = { number: match[1], text: [match[2]] };
      continue;
    }

    if (!sawFirstStep) {
      leadLines.push(line);
      continue;
    }

    if (currentStep) {
      currentStep.text.push(line);
    } else if (line.trim()) {
      leadLines.push(line);
    }
  }

  if (currentStep) {
    steps.push({ number: currentStep.number, text: currentStep.text.join("\n").trim() });
  }

  return {
    lead: leadLines.join("\n").trim(),
    steps,
  };
}

function PromptBody({ body }: { body: string }) {
  const { t } = useLanguage();

  if (!body.trim()) {
    return (
      <p className="rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm leading-7 text-muted-foreground">
        {t.promptPack.noPromptBody}
      </p>
    );
  }

  const parsed = parsePromptSteps(body);

  if (parsed.steps.length === 0) {
    return (
      <pre className="max-h-[520px] overflow-auto rounded-2xl border border-border/60 bg-muted/50 p-4 whitespace-pre-wrap break-words text-sm leading-7">
        {body || t.promptPack.noPromptBody}
      </pre>
    );
  }

  return (
    <div className="space-y-4">
      {parsed.lead ? (
        <section className="rounded-2xl border border-border/60 bg-muted/30 p-4">
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-muted-foreground">{parsed.lead}</p>
        </section>
      ) : null}
      <div className="space-y-3">
        {parsed.steps.map((step) => (
          <section key={step.number} className="rounded-2xl border border-border/60 bg-background p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">
                {step.number}
              </div>
              <p className="min-w-0 whitespace-pre-wrap break-words text-sm leading-7 text-foreground">{step.text}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function PromptBlock({ title, prompt, kind }: { title: string; prompt?: PromptBlockType; kind: "frontend" | "backend" }) {
  const { t } = useLanguage();
  const PromptIcon = kind === "frontend" ? PanelTopOpen : ServerCog;

  if (!prompt?.needed) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <PromptIcon className="size-5 text-muted-foreground" aria-hidden="true" />
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            {kind === "frontend" ? t.promptPack.noFrontendChanges : t.promptPack.noBackendChanges}
          </p>
        </CardContent>
      </Card>
    );
  }

  const body = prompt.body ?? prompt.prompt ?? "";
  const copyablePrompt = buildCopyablePrompt(title, prompt, body, t.promptPack);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PromptIcon className="size-5 text-muted-foreground" aria-hidden="true" />
              {title}
            </CardTitle>
            <CardDescription>{prompt.title ?? title}</CardDescription>
          </div>
          <CopyButton value={copyablePrompt} label={t.promptPack.copyPrompt} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <PromptBody body={body} />
        <div className="space-y-4">
          <PromptList title={t.promptPack.affectedFiles} items={prompt.affected_files} />
          <PromptList title={t.promptPack.doNotModify} items={prompt.do_not_modify} />
          <PromptList title={t.promptPack.verificationSteps} items={prompt.verification_steps} />
        </div>
      </CardContent>
    </Card>
  );
}

function PromptPackDetail({ pack }: { pack: PromptPack }) {
  const { locale, t } = useLanguage();
  const content = pack.content;
  const acceptanceChecklist = Array.isArray(content.acceptance_checklist) ? content.acceptance_checklist : [];
  const rollbackNotes = Array.isArray(content.rollback_notes) ? content.rollback_notes : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <CardTitle className="min-w-0 text-base font-semibold leading-8 text-[oklch(0.42_0.06_55)] dark:text-[oklch(0.82_0.08_65)]">
              {pack.title}
            </CardTitle>
            <p className="pb-4 text-xs text-muted-foreground">{formatDateTime(pack.created_at, locale)}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <PromptBlock title={t.promptPack.backendPrompt} prompt={content.backend_prompt} kind="backend" />
            <PromptBlock title={t.promptPack.frontendPrompt} prompt={content.frontend_prompt} kind="frontend" />
          </div>
          <div className="space-y-4">
            <DiffSummaryPanel summary={content.diff_summary} />
            <PromptList title={t.promptPack.rollbackNotes} items={rollbackNotes} />
          </div>
          <div className="space-y-4">
            <PromptList title={t.promptPack.acceptanceChecklist} items={acceptanceChecklist} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PromptsPage() {
  const { t } = useLanguage();
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [packs, setPacks] = useState<PromptPack[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useMountedRef();
  const refreshInFlightRef = useInFlightRef();

  const sortedPacks = useMemo(() => sortAssetsByVersion(packs), [packs]);
  const currentPack = useMemo(() => sortedPacks[0] ?? null, [sortedPacks]);
  const selectedPack = sortedPacks.find((pack) => pack.id === selectedId) ?? currentPack;
  const versionListPacks = useMemo(
    () =>
      sortedPacks.map((pack, index) => ({
        ...pack,
        is_current: index === 0,
      })),
    [sortedPacks]
  );

  const loadData = async (options?: { silent?: boolean; signal?: AbortSignal }) => {
    if (options?.silent && refreshInFlightRef.current) {
      return;
    }
    if (options?.silent) {
      refreshInFlightRef.current = true;
    }
    if (!options?.silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const data = sortAssetsByVersion(await listPromptPacks(projectId, { signal: options?.signal }));
      if (mountedRef.current && !options?.signal?.aborted) {
        setPacks(data);
        setSelectedId((current) => (current && data.some((pack) => pack.id === current) ? current : data[0]?.id ?? null));
        setError(null);
      }
    } catch (err) {
      if (isAbortError(err)) {
        return;
      }
      if (!options?.silent && mountedRef.current) {
        setError(err instanceof Error ? err.message : t.promptPack.loadFailed);
      }
    } finally {
      if (options?.silent) {
        refreshInFlightRef.current = false;
      }
      if (!options?.silent && mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void loadData({ signal: controller.signal });
    }, 0);
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadData({ silent: true, signal: controller.signal });
      }
    }, PROJECT_REFRESH_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadData({ silent: true, signal: controller.signal });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-6 lg:flex lg:h-full lg:min-h-0 lg:flex-1 lg:flex-col">
      {loading ? <LoadingState label={t.promptPack.loading} /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel={t.common.reload} onAction={loadData} /> : null}
      {!loading && !error && sortedPacks.length === 0 ? (
        <EmptyState
          title={t.promptPack.emptyTitle}
          description={t.promptPack.emptyDescription}
          action={
            <Button asChild variant="outline">
              <Link href={`/projects/${projectId}/change-sets`}>{t.promptPack.goToChangeSets}</Link>
            </Button>
          }
        />
      ) : null}
      {!loading && !error && currentPack && selectedPack ? (
        <div className="grid gap-4 xl:h-0 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] xl:items-stretch">
          <VersionList
            assets={versionListPacks}
            selectedId={selectedPack.id}
            onSelect={setSelectedId}
            title={t.promptPack.versions}
            showCreatedAt
          />
          <div className="min-h-0 overflow-y-auto xl:pr-4">
            <PromptPackDetail pack={selectedPack} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
