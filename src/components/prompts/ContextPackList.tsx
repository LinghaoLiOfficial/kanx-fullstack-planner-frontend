import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ContextPack } from "@/lib/types/context-pack";

export const roleLabels: Record<string, string> = {
  frontend_engineer: "前端工程师",
  backend_engineer: "后端工程师",
  api_designer: "API 设计师",
  database_designer: "数据库设计师",
  integration_tester: "联调测试工程师",
};

export function getRoleLabel(role: string) {
  return roleLabels[role] ?? role;
}

export function ContextPackList({
  packs,
  selectedId,
  onSelect,
}: {
  packs: ContextPack[];
  selectedId: string | null;
  onSelect: (packId: string) => void;
}) {
  if (packs.length === 0) {
    return <p className="text-sm text-muted-foreground">暂无 Context Packs</p>;
  }

  return (
    <div className="space-y-2">
      {packs.map((pack) => (
        <button
          key={pack.id}
          type="button"
          onClick={() => onSelect(pack.id)}
          className={cn(
            "w-full rounded-2xl border border-border/60 bg-background px-4 py-3 text-left transition-colors hover:bg-muted",
            selectedId === pack.id && "border-foreground bg-muted"
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium">{pack.title}</span>
            <Badge variant="outline">{getRoleLabel(pack.role)}</Badge>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{pack.summary}</p>
        </button>
      ))}
    </div>
  );
}
