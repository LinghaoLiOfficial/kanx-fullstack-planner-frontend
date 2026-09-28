import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language/language-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DbEntity, DbRelationship } from "@/lib/types/db-model";

function formatRelationship(relationship: DbRelationship) {
  return `${relationship.from ?? relationship.field} -> ${relationship.to ?? relationship.target} (${relationship.type})`;
}

export function EntityTable({ entities }: { entities: DbEntity[] }) {
  const { t } = useLanguage();

  if (entities.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.designAssets.viewer.noDatabaseTables}</p>;
  }

  return (
    <div className="space-y-4">
      {entities.map((entity) => (
        <Card key={entity.name} className="bg-background/70">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{entity.name}</CardTitle>
                <CardDescription>{entity.description || t.designAssets.viewer.noTableDescription}</CardDescription>
              </div>
              {entity.table_name ? <Badge variant="outline">{entity.table_name}</Badge> : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Primary Key</TableHead>
                  <TableHead>Nullable</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entity.fields.map((field) => (
                  <TableRow key={`${entity.name}-${field.name}`}>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell className="font-mono text-xs">{field.type}</TableCell>
                    <TableCell>{field.primary_key ? t.common.yes : t.common.no}</TableCell>
                    <TableCell>{field.nullable ? t.common.yes : t.common.no}</TableCell>
                    <TableCell className="text-muted-foreground">{field.description || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {entity.relationships?.length ? (
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {entity.relationships.map((relationship) => (
                  <Badge key={`${relationship.from}-${relationship.to}-${relationship.type}`} variant="secondary">
                    {formatRelationship(relationship)}
                  </Badge>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
