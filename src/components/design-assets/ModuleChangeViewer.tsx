"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Clipboard,
  FilePlus2,
  Minus,
  Pencil,
  Plus,
} from "lucide-react";

import { useLanguage } from "@/components/language/language-provider";
import { getAffectedLayerLabel } from "@/lib/design-asset-labels";
import type { ChangeSet } from "@/lib/types/change-set";
import type { ModuleChangeGroup } from "@/lib/types/design-asset";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type ChangeOperation = keyof ModuleChangeGroup;
type FilterOperation = "all" | ChangeOperation;

type NormalizedChangeItem = {
  raw: unknown;
  title: string;
  field: string | null;
  selector: Record<string, unknown>;
  before: unknown;
  after: unknown;
  reason: string | null;
  constraints: unknown[];
  dependencies: unknown[];
  acceptanceCriteria: unknown[];
};

const operationMeta: Record<ChangeOperation, {
  icon: typeof Plus;
  iconClass: string;
  accentClass: string;
  surfaceClass: string;
}> = {
  added: {
    icon: Plus,
    iconClass: "text-emerald-700 dark:text-emerald-300",
    accentClass: "border-l-emerald-500",
    surfaceClass: "bg-emerald-50/60 dark:bg-emerald-950/20",
  },
  modified: {
    icon: Pencil,
    iconClass: "text-orange-700 dark:text-orange-300",
    accentClass: "border-l-orange-500",
    surfaceClass: "bg-orange-50/60 dark:bg-orange-950/20",
  },
  removed: {
    icon: Minus,
    iconClass: "text-red-700 dark:text-red-300",
    accentClass: "border-l-red-500",
    surfaceClass: "bg-red-50/60 dark:bg-red-950/20",
  },
};

const moduleOrder = [
  "ux_design",
  "ui_design",
  "frontend_implementation",
  "frontend_pages",
  "frontend_tools",
  "api_contract",
  "backend_implementation",
  "backend_services",
  "backend_tools",
  "database_model",
  "db_model",
  "database_models",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringifyValue(value: unknown, missingLabel = "未提供") {
  if (value === null || value === undefined) {
    return missingLabel;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function compactValue(value: unknown, missingLabel = "未提供") {
  if (value === null || value === undefined) {
    return missingLabel;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (isRecord(value)) {
    const candidate = value.title ?? value.name ?? value.target ?? value.path ?? value.id;
    if (typeof candidate === "string" || typeof candidate === "number") {
      return String(candidate);
    }
  }

  return stringifyValue(value, missingLabel);
}

function selectorLabel(selector: Record<string, unknown>, missingLabel = "未提供") {
  return Object.entries(selector)
    .map(([key, value]) => `${key}: ${compactValue(value, missingLabel)}`)
    .join(" · ");
}

function normalizeItem(item: unknown, operation: ChangeOperation, labels: { unnamedChange: string; missing: string }): NormalizedChangeItem {
  if (!isRecord(item)) {
    return {
      raw: item,
      title: compactValue(item, labels.missing),
      field: null,
      selector: {},
      before: operation === "removed" ? item : null,
      after: operation === "added" ? item : null,
      reason: null,
      constraints: [],
      dependencies: [],
      acceptanceCriteria: [],
    };
  }

  const selector = isRecord(item.selector) ? item.selector : {};
  const titleValue = item.title ?? item.name ?? item.target ?? item.path ?? item.id ?? item.field;

  return {
    raw: item,
    title: typeof titleValue === "string" || typeof titleValue === "number"
      ? String(titleValue)
      : selectorLabel(selector, labels.missing) || labels.unnamedChange,
    field: typeof item.field === "string" ? item.field : null,
    selector,
    before: item.before,
    after: item.after,
    reason: typeof item.reason === "string" ? item.reason : null,
    constraints: Array.isArray(item.constraints) ? item.constraints : [],
    dependencies: Array.isArray(item.dependencies) ? item.dependencies : [],
    acceptanceCriteria: Array.isArray(item.acceptance_criteria) ? item.acceptance_criteria : [],
  };
}

function hasValue(value: unknown) {
  return value !== null && value !== undefined;
}

function CopyButton({ value }: { value: unknown }) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  return (
    <button
      type="button"
      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={copied ? t.designAssets.moduleChanges.copied : t.designAssets.moduleChanges.copyChange}
      title={copied ? t.designAssets.moduleChanges.copied : t.designAssets.moduleChanges.copyChange}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(stringifyValue(value, t.common.missing));
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Clipboard className="size-3.5" />}
    </button>
  );
}

function ValueBlock({ label, value, tone }: { label: string; value: unknown; tone: "before" | "after" | "neutral" }) {
  const { t } = useLanguage();

  return (
    <div className={cn(
      "min-w-0 rounded-md border p-3",
      tone === "before" && "border-red-200/80 bg-red-50/50 dark:border-red-900/60 dark:bg-red-950/20",
      tone === "after" && "border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20",
      tone === "neutral" && "border-border/70 bg-background/70",
    )}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <CopyButton value={value} />
      </div>
      <pre className="mt-2 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-foreground">
        {stringifyValue(value, t.common.missing)}
      </pre>
    </div>
  );
}

function ObjectDiff({ before, after }: { before: Record<string, unknown>; after: Record<string, unknown> }) {
  const { t } = useLanguage();
  const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));

  return (
    <div className="overflow-hidden rounded-md border border-border/70">
      {keys.map((key) => {
        const hasBefore = Object.prototype.hasOwnProperty.call(before, key);
        const hasAfter = Object.prototype.hasOwnProperty.call(after, key);
        const changed = stringifyValue(before[key], t.common.missing) !== stringifyValue(after[key], t.common.missing);

        if (!changed && hasBefore && hasAfter) {
          return null;
        }

        return (
          <div key={key} className="grid gap-2 border-b border-border/60 p-3 last:border-b-0 md:grid-cols-[minmax(7rem,0.4fr)_minmax(0,1fr)]">
            <span className="break-words text-sm font-medium text-muted-foreground">{key}</span>
            <div className="grid min-w-0 gap-2">
              {hasBefore ? <ValueBlock label={t.designAssets.moduleChanges.before} value={before[key]} tone="before" /> : null}
              {hasAfter ? <ValueBlock label={t.designAssets.moduleChanges.after} value={after[key]} tone="after" /> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChangeDetails({ item }: { item: NormalizedChangeItem }) {
  const { t } = useLanguage();
  const details = [
    [t.designAssets.moduleChanges.reason, item.reason ? [item.reason] : []],
    [t.designAssets.moduleChanges.constraints, item.constraints],
    [t.designAssets.moduleChanges.dependencies, item.dependencies],
    [t.designAssets.moduleChanges.acceptanceCriteria, item.acceptanceCriteria],
  ] as const;
  const visibleDetails = details.filter(([, values]) => values.length > 0);

  if (visibleDetails.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-3 rounded-md border border-border/60 bg-background/50 p-3">
      {visibleDetails.map(([label, values]) => (
        <div key={label}>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <ul className="mt-1 space-y-1 text-sm leading-6 text-foreground">
            {values.map((value, index) => <li key={index} className="break-words">{compactValue(value, t.common.missing)}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ChangeItem({ operation, item }: { operation: ChangeOperation; item: NormalizedChangeItem }) {
  const meta = operationMeta[operation];
  const { t } = useLanguage();
  const Icon = meta.icon;
  const selector = selectorLabel(item.selector, t.common.missing);
  const operationLabel = t.designAssets.diff[operation];

  return (
    <article className={cn("border-l-4 p-3", meta.accentClass, meta.surfaceClass)}>
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-background", meta.iconClass)}>
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{operationLabel}</span>
                <h4 className="break-words text-sm font-medium text-foreground">{item.title}</h4>
              </div>
              {item.field ? <p className="mt-1 break-words text-sm text-muted-foreground">{t.designAssets.moduleChanges.field}: {item.field}</p> : null}
              {selector && selector !== item.title ? <p className="mt-1 break-words text-sm text-muted-foreground">{t.designAssets.moduleChanges.selector}: {selector}</p> : null}
            </div>
            <CopyButton value={item.raw} />
          </div>

          {operation === "modified" ? (
            <div className="mt-3">
              {isRecord(item.before) && isRecord(item.after) ? (
                <ObjectDiff before={item.before} after={item.after} />
              ) : (
                <div className="grid gap-2 md:grid-cols-2">
                  <ValueBlock label={t.designAssets.moduleChanges.before} value={item.before} tone="before" />
                  <ValueBlock label={t.designAssets.moduleChanges.after} value={item.after} tone="after" />
                </div>
              )}
            </div>
          ) : null}

          {operation === "added" && hasValue(item.after) ? <ValueBlock label={t.designAssets.moduleChanges.addedContent} value={item.after} tone="neutral" /> : null}
          {operation === "removed" && hasValue(item.before) ? <ValueBlock label={t.designAssets.moduleChanges.removedContent} value={item.before} tone="before" /> : null}
          <ChangeDetails item={item} />
        </div>
      </div>
    </article>
  );
}

function OperationSummary({ operation, count, active, onClick }: { operation: FilterOperation; count: number; active: boolean; onClick: () => void }) {
  const isAll = operation === "all";
  const meta = isAll ? null : operationMeta[operation];
  const { t } = useLanguage();
  const Icon = meta?.icon ?? FilePlus2;
  const label = isAll ? t.designAssets.moduleChanges.all : t.designAssets.diff[operation];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "border-foreground bg-muted" : "border-border/70 bg-background hover:bg-muted/60",
      )}
    >
      <Icon className={cn("size-4 shrink-0", meta?.iconClass ?? "text-muted-foreground")} aria-hidden="true" />
      <span className="min-w-0 text-sm font-medium">{label}</span>
      <span className="ml-auto text-sm font-semibold tabular-nums">{count}</span>
    </button>
  );
}

function ModuleSection({
  moduleKey,
  group,
  filter,
  version,
}: {
  moduleKey: string;
  group: ModuleChangeGroup;
  filter: FilterOperation;
  version?: number;
}) {
  const { locale, t } = useLanguage();
  const visibleOperations = (Object.keys(operationMeta) as ChangeOperation[]).filter(
    (operation) => filter === "all" || filter === operation,
  );
  const counts = {
    added: group.added?.length ?? 0,
    modified: group.modified?.length ?? 0,
    removed: group.removed?.length ?? 0,
  };
  const total = counts.added + counts.modified + counts.removed;

  return (
    <section className="overflow-hidden rounded-lg border border-border/70">
      <div className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span className="min-w-0 break-words text-sm font-semibold">{getAffectedLayerLabel(moduleKey, locale)}</span>
          {version !== undefined ? <Badge variant="outline">v{version}</Badge> : null}
        </div>
        <span className="hidden shrink-0 text-sm text-muted-foreground sm:inline">{t.designAssets.moduleChanges.itemCount(total)}</span>
        <div className="flex shrink-0 items-center gap-1.5" aria-label={t.designAssets.moduleChanges.changeCountLabel}>
          {counts.added > 0 ? <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">+{counts.added}</span> : null}
          {counts.modified > 0 ? <span className="text-sm font-medium text-orange-700 dark:text-orange-300">~{counts.modified}</span> : null}
          {counts.removed > 0 ? <span className="text-sm font-medium text-red-700 dark:text-red-300">-{counts.removed}</span> : null}
        </div>
      </div>
      <div className="space-y-4 border-t border-border/70 p-4">
        {visibleOperations.map((operation) => {
          const items = group[operation] ?? [];
          if (items.length === 0) {
            return null;
          }

          return (
            <div key={operation}>
              <div className="mb-2 flex items-center gap-2">
                <span className={cn("text-sm font-semibold", operationMeta[operation].iconClass)}>{t.designAssets.diff[operation]}</span>
                <span className="text-sm text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <ChangeItem key={`${operation}-${index}`} operation={operation} item={normalizeItem(item, operation, { unnamedChange: t.designAssets.diff.unnamedChange, missing: t.common.missing })} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ModuleChangeViewer({
  moduleChanges,
  version,
}: {
  moduleChanges: ChangeSet["module_changes"];
  version?: number;
}) {
  const { t } = useLanguage();
  const entries = useMemo(() => {
    const knownKeys = moduleOrder.filter((key) => Boolean(moduleChanges[key as keyof ChangeSet["module_changes"]]));
    const extraKeys = Object.keys(moduleChanges).filter((key) => !moduleOrder.includes(key));

    return [...knownKeys, ...extraKeys]
      .map((moduleKey) => {
        const group = moduleChanges[moduleKey as keyof ChangeSet["module_changes"]] as ModuleChangeGroup | undefined;
        const normalized = {
          added: group?.added ?? [],
          modified: group?.modified ?? [],
          removed: group?.removed ?? [],
        };
        return [moduleKey, normalized] as const;
      })
      .filter(([, group]) => group.added.length + group.modified.length + group.removed.length > 0);
  }, [moduleChanges]);
  const [filter, setFilter] = useState<FilterOperation>("all");

  const totals = entries.reduce(
    (result, [, group]) => ({
      added: result.added + group.added.length,
      modified: result.modified + group.modified.length,
      removed: result.removed + group.removed.length,
    }),
    { added: 0, modified: 0, removed: 0 },
  );
  const total = totals.added + totals.modified + totals.removed;

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-border/70 p-4">
        <div className="flex items-center gap-2">
          <FilePlus2 className="size-4 text-muted-foreground" aria-hidden="true" />
          <h3 className="text-sm font-semibold">{t.designAssets.moduleChanges.moduleChanges}</h3>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.designAssets.moduleChanges.empty}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label={t.designAssets.moduleChanges.filterLabel}>
        <OperationSummary operation="all" count={total} active={filter === "all"} onClick={() => setFilter("all")} />
        <OperationSummary operation="added" count={totals.added} active={filter === "added"} onClick={() => setFilter("added")} />
        <OperationSummary operation="modified" count={totals.modified} active={filter === "modified"} onClick={() => setFilter("modified")} />
        <OperationSummary operation="removed" count={totals.removed} active={filter === "removed"} onClick={() => setFilter("removed")} />
      </div>
      <div className="space-y-3">
        {entries
          .filter(([, group]) => filter === "all" || group[filter].length > 0)
          .map(([moduleKey, group]) => (
            <ModuleSection
              key={moduleKey}
              moduleKey={moduleKey}
              group={group}
              filter={filter}
              version={version}
            />
          ))}
      </div>
    </div>
  );
}
