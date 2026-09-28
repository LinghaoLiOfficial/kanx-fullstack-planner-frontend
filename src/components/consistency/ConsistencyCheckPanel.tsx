import { ShieldCheck } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { ConsistencyItemList } from "@/components/consistency/ConsistencyItemList";
import { useLanguage } from "@/components/language/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConsistencyCheck } from "@/lib/types/consistency";

const statusClasses: Record<ConsistencyCheck["status"], string> = {
  passed: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  failed: "border-destructive/40 bg-destructive/10 text-destructive",
};

export function ConsistencyCheckPanel({ check }: { check: ConsistencyCheck | null }) {
  const { t } = useLanguage();

  if (!check) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title={t.consistency.emptyTitle}
        description={t.consistency.emptyDescription}
      />
    );
  }

  const className = statusClasses[check.status] ?? "border-border bg-secondary text-secondary-foreground";
  const label = t.consistency.statuses[check.status] ?? check.status;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{t.consistency.resultTitle}</CardTitle>
            <CardDescription>{t.consistency.resultDescription}</CardDescription>
          </div>
          <Badge className={className}>{label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ConsistencyItemList items={check.items} />
      </CardContent>
    </Card>
  );
}
