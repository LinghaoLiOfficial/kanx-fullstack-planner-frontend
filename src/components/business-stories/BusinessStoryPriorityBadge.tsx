import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language/language-provider";
import { dictionaries } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { BusinessStoryPriority } from "@/lib/types/business-story";

const priorityLabels = dictionaries["zh-CN"].businessStories.priorities;
const priorityBadgeLabels = dictionaries["zh-CN"].businessStories.priorityBadges;

const priorityClasses: Record<BusinessStoryPriority, string> = {
  p1_must: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300",
  p2_should: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
  p3_could: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300",
  p4_wont: "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300",
};

export function BusinessStoryPriorityBadge({
  priority,
}: {
  priority: BusinessStoryPriority;
}) {
  const { t } = useLanguage();

  return (
    <Badge variant="outline" className={cn("whitespace-nowrap", priorityClasses[priority])}>
      {t.businessStories.priorityBadges[priority]}
    </Badge>
  );
}

export { priorityBadgeLabels, priorityLabels };
