import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language/language-provider";
import type { DbIndex, DbRelationship } from "@/lib/types/db-model";

export function RelationshipList({ relationships }: { relationships: DbRelationship[] }) {
  const { t } = useLanguage();

  if (relationships.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.designAssets.viewer.noRelationships}</p>;
  }

  return (
    <div className="space-y-2">
      {relationships.map((item) => (
        <div key={`${item.from ?? item.field}-${item.to ?? item.target}-${item.type}`} className="rounded-2xl border border-border/60 bg-background/70 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{item.from ?? item.field}</span>
            <Badge variant="outline">{item.type}</Badge>
            <span className="font-medium">{item.to ?? item.target}</span>
          </div>
          {item.description ? <p className="mt-2 text-sm text-muted-foreground">{item.description}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function IndexList({ indexes }: { indexes: DbIndex[] }) {
  const { t } = useLanguage();

  if (indexes.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.designAssets.viewer.noIndexes}</p>;
  }

  return (
    <div className="space-y-2">
      {indexes.map((item) => (
        <div key={`${item.table}-${item.fields.join("-")}`} className="rounded-2xl border border-border/60 bg-background/70 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{item.table}</Badge>
            <span className="font-mono text-xs">{item.fields.join(", ")}</span>
          </div>
          {item.reason ? <p className="mt-2 text-sm text-muted-foreground">{item.reason}</p> : null}
        </div>
      ))}
    </div>
  );
}
