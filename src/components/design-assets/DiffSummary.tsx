import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/language/language-provider";
import { cn } from "@/lib/utils";
import { FilePlus2, Minus, Pencil, Plus } from "lucide-react";

type DiffOperation = "added" | "modified" | "removed";

type DiffItem = {
  raw: unknown;
  title: string;
  detail: string | null;
};

const operationMeta: Record<DiffOperation, {
  icon: typeof Plus;
  iconClass: string;
  borderClass: string;
  surfaceClass: string;
}> = {
  added: {
    icon: Plus,
    iconClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-200/80 dark:border-emerald-900/60",
    surfaceClass: "bg-emerald-50/60 dark:bg-emerald-950/20",
  },
  modified: {
    icon: Pencil,
    iconClass: "text-orange-700 dark:text-orange-300",
    borderClass: "border-orange-200/80 dark:border-orange-900/60",
    surfaceClass: "bg-orange-50/60 dark:bg-orange-950/20",
  },
  removed: {
    icon: Minus,
    iconClass: "text-red-700 dark:text-red-300",
    borderClass: "border-red-200/80 dark:border-red-900/60",
    surfaceClass: "bg-red-50/60 dark:bg-red-950/20",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringifyValue(value: unknown, missingLabel = "") {
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

function compactValue(value: unknown, missingLabel?: string) {
  const text = stringifyValue(value, missingLabel).replace(/\s+/g, " ").trim();
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}

function pickString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
  }

  return null;
}

function selectorSummary(selector: unknown, missingLabel?: string) {
  if (!isRecord(selector)) {
    return null;
  }

  const entries = Object.entries(selector).filter(([, value]) => value !== null && value !== undefined);
  if (entries.length === 0) {
    return null;
  }

  return entries.map(([key, value]) => `${key}: ${compactValue(value, missingLabel)}`).join(" · ");
}

function normalizeDiffItem(item: unknown, unnamedChange: string, missingLabel: string): DiffItem {
  if (!isRecord(item)) {
    return {
      raw: item,
      title: compactValue(item, missingLabel),
      detail: null,
    };
  }

  const title =
    pickString(item, ["title", "name", "target", "path", "endpoint_path", "table_name", "field", "id"]) ??
    selectorSummary(item.selector, missingLabel) ??
    unnamedChange;
  const detail =
    pickString(item, ["reason", "summary", "description", "purpose", "change", "impact"]) ??
    selectorSummary(item.selector, missingLabel) ??
    compactValue(item, missingLabel);

  return {
    raw: item,
    title,
    detail: detail === title ? null : detail,
  };
}

function normalizeOperationItems(diff: Record<string, unknown>, operation: DiffOperation, unnamedChange: string, missingLabel: string) {
  const value = diff[operation];
  if (Array.isArray(value)) {
    return value.map((item) => normalizeDiffItem(item, unnamedChange, missingLabel));
  }

  if (value === null || value === undefined) {
    return [];
  }

  return [normalizeDiffItem(value, unnamedChange, missingLabel)];
}

function isStandardDiff(diff: unknown): diff is Record<DiffOperation, unknown> {
  return isRecord(diff) && (
    Object.prototype.hasOwnProperty.call(diff, "added") ||
    Object.prototype.hasOwnProperty.call(diff, "modified") ||
    Object.prototype.hasOwnProperty.call(diff, "removed")
  );
}

function DiffStat({
  operation,
  count,
}: {
  operation: DiffOperation;
  count: number;
}) {
  const meta = operationMeta[operation];
  const { t } = useLanguage();
  const labels = t.designAssets.diff;
  const label = labels[operation];
  const Icon = meta.icon;

  return (
    <div className={cn("flex min-w-0 items-center gap-2 rounded-md border px-3 py-2", meta.borderClass, meta.surfaceClass)}>
      <Icon className={cn("size-4 shrink-0", meta.iconClass)} aria-hidden="true" />
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="ml-auto text-sm font-semibold tabular-nums">{count}</span>
    </div>
  );
}

function DiffItemCard({ item }: { item: DiffItem }) {
  return (
    <article className="min-w-0 rounded-md border border-border/60 bg-background/70 p-3">
      <div className="min-w-0">
        <h4 className="break-words text-sm font-medium text-foreground">{item.title}</h4>
        {item.detail ? <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{item.detail}</p> : null}
      </div>
    </article>
  );
}

function DiffOperationSection({
  operation,
  items,
}: {
  operation: DiffOperation;
  items: DiffItem[];
}) {
  const meta = operationMeta[operation];
  const { t } = useLanguage();
  const labels = t.designAssets.diff;
  const label = labels[operation];
  const emptyLabel = {
    added: labels.noAdded,
    modified: labels.noModified,
    removed: labels.noRemoved,
  }[operation];
  const Icon = meta.icon;

  return (
    <section className={cn("min-w-0 rounded-lg border p-4", meta.borderClass, meta.surfaceClass)}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("size-4 shrink-0", meta.iconClass)} aria-hidden="true" />
        <h3 className="text-sm font-semibold">{label}</h3>
        <Badge variant="outline" className="bg-background/70">
          {items.length}
        </Badge>
      </div>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <DiffItemCard key={index} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">{emptyLabel}</p>
      )}
    </section>
  );
}

function RawDiffViewer({ diff }: { diff: unknown }) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.designAssets.diff.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="max-h-[560px] overflow-auto rounded-[1.5rem] border border-border/60 bg-muted/50 p-4 font-mono text-xs leading-6 text-foreground">
          <code>{stringifyValue(diff, t.common.missing)}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

export function DiffSummary({ diff }: { diff: unknown }) {
  const { t } = useLanguage();

  if (!diff) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.designAssets.diff.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">{t.designAssets.diff.empty}</p>
        </CardContent>
      </Card>
    );
  }

  if (isStandardDiff(diff)) {
    const itemsByOperation = {
      added: normalizeOperationItems(diff, "added", t.designAssets.diff.unnamedChange, t.common.missing),
      modified: normalizeOperationItems(diff, "modified", t.designAssets.diff.unnamedChange, t.common.missing),
      removed: normalizeOperationItems(diff, "removed", t.designAssets.diff.unnamedChange, t.common.missing),
    };
    const total =
      itemsByOperation.added.length +
      itemsByOperation.modified.length +
      itemsByOperation.removed.length;

    return (
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <FilePlus2 className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <CardTitle>{t.designAssets.diff.title}</CardTitle>
            </div>
            <Badge variant="secondary">{t.designAssets.diff.itemCount(total)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <DiffStat operation="added" count={itemsByOperation.added.length} />
            <DiffStat operation="modified" count={itemsByOperation.modified.length} />
            <DiffStat operation="removed" count={itemsByOperation.removed.length} />
          </div>
          {total > 0 ? (
            <div className="grid gap-3">
              {itemsByOperation.added.length > 0 ? (
                <DiffOperationSection operation="added" items={itemsByOperation.added} />
              ) : null}
              {itemsByOperation.modified.length > 0 ? (
                <DiffOperationSection operation="modified" items={itemsByOperation.modified} />
              ) : null}
              {itemsByOperation.removed.length > 0 ? (
                <DiffOperationSection operation="removed" items={itemsByOperation.removed} />
              ) : null}
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{t.designAssets.diff.empty}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (typeof diff === "string") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.designAssets.diff.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{diff}</p>
        </CardContent>
      </Card>
    );
  }

  if (isRecord(diff)) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <FilePlus2 className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <CardTitle>{t.designAssets.diff.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-6 text-muted-foreground">{t.designAssets.diff.nonStandard}</p>
          <div className="grid gap-2">
            {Object.entries(diff).map(([key, value]) => (
              <article key={key} className="min-w-0 rounded-md border border-border/60 bg-muted/30 p-3">
                <h3 className="break-words text-sm font-medium text-foreground">{key}</h3>
                <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{compactValue(value, t.common.missing)}</p>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return <RawDiffViewer diff={diff} />;
}
