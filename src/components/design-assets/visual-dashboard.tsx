import type { ReactNode } from "react";
import { ArrowRight, Circle, Database, FileJson, GitBranch, Route, Workflow } from "lucide-react";

import { JsonViewer } from "@/components/common/JsonViewer";
import { useLanguage } from "@/components/language/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type MetricItem = {
  label: string;
  value: ReactNode;
  description?: ReactNode;
};

export type TimelineStep = {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  tone?: "default" | "success" | "error" | "warning" | "muted";
  details?: ReactNode;
};

export type RelationshipNode = {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  tone?: "default" | "accent" | "success" | "warning" | "error" | "muted";
};

export type RelationshipEdge = {
  from: string;
  to: string;
  label?: ReactNode;
};

const toneClasses = {
  default: "border-border/70 bg-background",
  accent: "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-100",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-100",
  warning: "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100",
  error: "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-100",
  muted: "border-border/60 bg-muted/30",
};

const dotToneClasses = {
  default: "border-border bg-background",
  success: "border-emerald-500 bg-emerald-500",
  error: "border-rose-500 bg-rose-500",
  warning: "border-amber-500 bg-amber-500",
  muted: "border-muted-foreground bg-muted-foreground",
};

export function MetricStrip({ items }: { items: MetricItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-border/70 bg-muted/20 p-4">
          <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
          <div className="mt-2 text-2xl font-semibold leading-none">{item.value}</div>
          {item.description ? <div className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</div> : null}
        </div>
      ))}
    </div>
  );
}

export function VisualSection({
  title,
  description,
  icon,
  action,
  children,
  empty,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  empty?: boolean | ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <section className="space-y-4 rounded-lg border border-border/70 bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex h-8 min-w-0 items-center gap-3">
            {icon ? (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/30 text-muted-foreground">
                {icon}
              </div>
            ) : null}
            <h2 className="min-w-0 text-base font-semibold leading-6">{title}</h2>
          </div>
          {description ? <p className={cn("mt-1 text-sm leading-6 text-muted-foreground", icon ? "pl-11" : "")}>{description}</p> : null}
        </div>
        {action}
      </div>
      {empty ? (
        <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
          {typeof empty === "boolean" ? t.common.noData : empty}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

export function FlowTimeline({
  steps,
  showConnectors = true,
  variant = "default",
}: {
  steps: TimelineStep[];
  showConnectors?: boolean;
  variant?: "default" | "dotLabel";
}) {
  const { t } = useLanguage();

  if (steps.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{t.designAssets.visual.noSteps}</p>;
  }

  return (
    <ol className="space-y-3">
      {steps.map((step, index) => {
        const tone = step.tone ?? "default";
        const dot = <span className={cn("z-10 h-3 w-3 rounded-full border-2", dotToneClasses[tone])} />;

        if (variant === "dotLabel") {
          return (
            <li key={index}>
              <div className="min-w-0 rounded-lg border border-border/70 bg-background/70 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  {step.meta ? (
                    <span className="shrink-0 rounded-md bg-foreground px-2 py-1 text-xs font-medium leading-none text-background">
                      {step.meta}
                    </span>
                  ) : null}
                  <div className="min-w-0 flex-1 text-sm font-medium leading-6">{step.title}</div>
                </div>
                {step.description ? <div className="mt-1 text-sm leading-6 text-muted-foreground">{step.description}</div> : null}
                {step.details ? <div className="mt-3">{step.details}</div> : null}
              </div>
            </li>
          );
        }

        return (
          <li key={index} className="grid grid-cols-[1.5rem_auto_minmax(0,1fr)] items-stretch gap-x-1 [&>*:nth-child(3)]:ml-2">
            <div className="relative flex h-full items-center justify-center">
              {dot}
              {showConnectors && index < steps.length - 1 ? <span className="absolute top-1/2 h-[calc(100%+0.75rem)] w-px bg-border" /> : null}
            </div>
            <div className="flex items-center whitespace-nowrap text-sm text-muted-foreground">{step.meta}</div>
            <div className="rounded-lg border border-border/70 bg-background/70 p-3">
              <div className="flex flex-wrap items-start gap-2">
                <div className="min-w-0 text-sm font-medium leading-6">{step.title}</div>
              </div>
              {step.description ? <div className="mt-1 text-sm leading-6 text-muted-foreground">{step.description}</div> : null}
              {step.details ? <div className="mt-3">{step.details}</div> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function RelationshipMap({
  nodes,
  edges = [],
  emptyText,
}: {
  nodes: RelationshipNode[];
  edges?: RelationshipEdge[];
  emptyText?: string;
}) {
  const { t } = useLanguage();

  if (nodes.length === 0 && edges.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{emptyText ?? t.designAssets.visual.noRelationship}</p>;
  }

  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="space-y-4">
      {nodes.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {nodes.map((node) => (
            <div key={node.id} className={cn("rounded-lg border p-3", toneClasses[node.tone ?? "default"])}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="whitespace-normal break-words text-sm font-medium">{node.title}</div>
                  {node.subtitle ? <div className="mt-1 text-sm leading-6 text-muted-foreground">{node.subtitle}</div> : null}
                </div>
                {node.badge}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {edges.length > 0 ? (
        <div className="space-y-2 rounded-lg border border-border/70 bg-muted/20 p-3">
          {edges.map((edge, index) => (
            <div key={`${edge.from}-${edge.to}-${index}`} className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="outline" className="max-w-full truncate">
                {nodeById.get(edge.from)?.title ?? edge.from}
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary" className="max-w-full truncate">
                {nodeById.get(edge.to)?.title ?? edge.to}
              </Badge>
              {edge.label ? <span className="text-sm text-muted-foreground">{edge.label}</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function schemaRows(value: unknown, labels: { yes: string; no: string }): Array<{ name: string; type: string; required: string; description: string }> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }
  const record = value as Record<string, unknown>;
  const properties = record.properties;
  if (properties && typeof properties === "object" && !Array.isArray(properties)) {
    const required = Array.isArray(record.required) ? record.required.map(String) : [];
    return Object.entries(properties as Record<string, unknown>).map(([name, property]) => {
      const item = property && typeof property === "object" && !Array.isArray(property) ? property as Record<string, unknown> : {};
      return {
        name,
        type: String(item.type ?? item.format ?? "-"),
        required: required.includes(name) ? labels.yes : labels.no,
        description: String(item.description ?? item.title ?? "-"),
      };
    });
  }
  return Object.entries(record).map(([name, item]) => ({
    name,
    type: typeof item,
    required: "-",
    description: item && typeof item === "object" ? JSON.stringify(item) : String(item ?? "-"),
  }));
}

export function SchemaPanel({ title, value }: { title: ReactNode; value: unknown }) {
  const { t } = useLanguage();
  const rows = schemaRows(value, { yes: t.common.yes, no: t.common.no });
  return (
    <div className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <FileJson className="h-4 w-4 text-muted-foreground" />
        {title}
      </div>
      {rows.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.designAssets.visual.field}</TableHead>
                <TableHead>{t.designAssets.visual.type}</TableHead>
                <TableHead>{t.designAssets.visual.required}</TableHead>
                <TableHead>{t.designAssets.visual.description}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-mono text-xs">{row.name}</TableCell>
                  <TableCell className="font-mono text-xs">{row.type}</TableCell>
                  <TableCell>{row.required}</TableCell>
                  <TableCell className="min-w-48 text-muted-foreground">{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
      <pre className="max-h-72 overflow-auto rounded-lg border border-border/60 bg-muted/40 p-3 font-mono text-xs leading-6">
        {JSON.stringify(value ?? {}, null, 2)}
      </pre>
    </div>
  );
}

export function StatusBadge({ label, tone = "default" }: { label: ReactNode; tone?: TimelineStep["tone"] }) {
  const className = {
    default: "",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
    error: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
    warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
    muted: "border-border bg-muted/40 text-muted-foreground",
  }[tone ?? "default"];
  return (
    <Badge variant="outline" className={cn("shrink-0 whitespace-nowrap", className)}>
      {label}
    </Badge>
  );
}

export function TextChips({ values, emptyText, numbered = false }: { values: string[]; emptyText?: string; numbered?: boolean }) {
  const { t } = useLanguage();

  if (values.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{emptyText ?? t.common.empty}</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value, index) => (
        <Badge key={`${value}-${index}`} variant="secondary" className="max-w-full gap-1.5 whitespace-normal text-left leading-5">
          {numbered ? (
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-background text-[10px] font-semibold leading-none text-muted-foreground">
              {index + 1}
            </span>
          ) : null}
          {value}
        </Badge>
      ))}
    </div>
  );
}

export function KeyValueTable({
  rows,
  columns,
}: {
  rows: Array<{ key: ReactNode; value: ReactNode; meta?: ReactNode }>;
  columns?: [string, string, string];
}) {
  const { t } = useLanguage();
  const resolvedColumns = columns ?? t.designAssets.visual.columns;

  if (rows.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{t.common.noData}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{resolvedColumns[0]}</TableHead>
            <TableHead>{resolvedColumns[1]}</TableHead>
            <TableHead>{resolvedColumns[2]}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="min-w-36 font-mono text-xs">{row.key}</TableCell>
              <TableCell className="min-w-56 text-muted-foreground">{row.value}</TableCell>
              <TableCell>{row.meta}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function JsonDebugCard({ data, title }: { data: unknown; title?: string }) {
  const { t } = useLanguage();

  return <JsonViewer data={data} title={title ?? t.designAssets.versions.fullJson} />;
}

export const visualIcons = {
  workflow: <Workflow className="h-4 w-4" />,
  route: <Route className="h-4 w-4" />,
  branch: <GitBranch className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  dot: <Circle className="h-4 w-4" />,
};

export function SummaryCard({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
