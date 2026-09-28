import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/language/language-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LegacyApiSchema } from "@/lib/types/api-contract";

export function SchemaList({ schemas }: { schemas: LegacyApiSchema[] }) {
  const { t } = useLanguage();

  if (schemas.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.designAssets.viewer.noApiSummary}</p>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {schemas.map((schema) => (
        <Card key={schema.name} className="bg-background/70">
          <CardHeader>
            <CardTitle className="text-base">{schema.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schema.fields.map((field) => (
                  <TableRow key={`${schema.name}-${field.name}`}>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell className="font-mono text-xs">{field.type}</TableCell>
                    <TableCell>{field.required ? t.common.yes : t.common.no}</TableCell>
                    <TableCell className="text-muted-foreground">{field.description || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
