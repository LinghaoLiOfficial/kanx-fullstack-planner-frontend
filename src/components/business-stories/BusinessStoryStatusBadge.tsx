import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language/language-provider";
import { dictionaries } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { BusinessStoryStatus } from "@/lib/types/business-story";

const statusLabels = dictionaries["zh-CN"].businessStories.statuses;

const statusClasses: Record<BusinessStoryStatus, string> = {
  draft: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300",
  ready: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300",
  selected: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300",
  applied: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  implemented: "border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-900/60 dark:bg-lime-950/40 dark:text-lime-300",
  verified: "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300",
  in_progress: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300",
  done: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  deferred: "border-stone-200 bg-stone-50 text-stone-700 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-300",
};

export function BusinessStoryStatusBadge({
  status,
}: {
  status: BusinessStoryStatus;
}) {
  const { t } = useLanguage();

  return (
    <Badge variant="outline" className={cn("whitespace-nowrap", statusClasses[status])}>
      {t.businessStories.statuses[status]}
    </Badge>
  );
}

export { statusLabels };
