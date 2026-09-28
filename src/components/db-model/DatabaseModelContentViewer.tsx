"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language/language-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import {
  MetricStrip,
  RelationshipMap,
  StatusBadge,
  TextChips,
  VisualSection,
  visualIcons,
} from "@/components/design-assets/visual-dashboard";
import { FieldHint } from "@/components/ui/field-hint";
import {
  databaseModelLegacySections,
} from "@/lib/database-model-contract";
import {
  isNewDbModelContent,
  type DatabaseField,
  type DbIndex,
  type DbModelContent,
  type DbRelationship,
  type NewDbModelContent,
} from "@/lib/types/db-model";

function relationshipTitle(relationship: DbRelationship) {
  return `${relationship.from ?? relationship.field ?? "-"} -> ${relationship.to ?? relationship.target ?? "-"} (${relationship.type})`;
}

function FieldTable({ fields }: { fields: DatabaseField[] }) {
  const { t } = useLanguage();
  const labels = t.designAssets.viewer;

  if (fields.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{labels.noFields}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{labels.fields}</TableHead>
            <TableHead>{t.designAssets.visual.type}</TableHead>
            <TableHead>{labels.primaryKey}</TableHead>
            <TableHead>{t.designAssets.visual.required}</TableHead>
            <TableHead>{labels.nullable}</TableHead>
            <TableHead>{t.designAssets.visual.description}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.name}>
              <TableCell className="font-mono text-xs">{field.name}</TableCell>
              <TableCell className="font-mono text-xs">{field.type}</TableCell>
              <TableCell>{field.primary_key ? t.common.yes : t.common.no}</TableCell>
              <TableCell>{field.required ? t.common.yes : t.common.no}</TableCell>
              <TableCell>{field.nullable ? t.common.yes : t.common.no}</TableCell>
              <TableCell className="min-w-48 text-muted-foreground">{field.description || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function IndexList({ indexes }: { indexes: DbIndex[] }) {
  const { t } = useLanguage();

  if (indexes.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{t.designAssets.viewer.noIndexes}</p>;
  }

  return (
    <div className="space-y-2">
      {indexes.map((index, itemIndex) => (
        <div key={`${index.table}-${index.fields.join("-")}-${itemIndex}`} className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{index.table}</Badge>
            <code className="text-xs text-muted-foreground">{index.fields.join(", ")}</code>
          </div>
          {index.reason ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{index.reason}</p> : null}
        </div>
      ))}
    </div>
  );
}

function RelationshipList({ relationships }: { relationships: DbRelationship[] }) {
  const { t } = useLanguage();

  if (relationships.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{t.designAssets.visual.noRelationship}</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {relationships.map((relationship, index) => (
        <StatusBadge key={`${relationshipTitle(relationship)}-${index}`} label={relationshipTitle(relationship)} tone="muted" />
      ))}
    </div>
  );
}

function NewDatabaseModelContentView({ content }: { content: NewDbModelContent }) {
  const { t } = useLanguage();
  const labels = t.designAssets.viewer;
  const tables = Array.isArray(content.database_tables) ? content.database_tables : [];
  const relationships = Array.isArray(content.relationships) ? content.relationships : [];
  const indexes = Array.isArray(content.indexes) ? content.indexes : [];
  const migrationNotes = Array.isArray(content.migration_notes) ? content.migration_notes : [];
  const fieldCount = tables.reduce((sum, table) => sum + (table.fields?.length ?? 0), 0);
  const tableRelationships = tables.flatMap((table) => table.relationships ?? []);
  const allRelationships = [...relationships, ...tableRelationships];
  const tableIndexes = tables.flatMap((table) => table.indexes ?? []);

  return (
    <div className="space-y-4">
      <MetricStrip
        items={[
          { label: labels.databaseTables, value: tables.length, description: content.database?.engine || labels.databaseEngineUnspecified },
          { label: labels.fields, value: fieldCount, description: labels.totalFields },
          { label: labels.relationships, value: allRelationships.length, description: labels.globalAndTableRelationships },
          { label: labels.indexesAndMigrations, value: `${indexes.length + tableIndexes.length} / ${migrationNotes.length}`, description: `${content.database?.orm || labels.ormUnspecified} · ${content.database?.migration_tool || labels.migrationToolUnspecified}` },
        ]}
      />

      <VisualSection
        title={
          <FieldHint
            label={labels.databaseRelationshipMap}
            hint={labels.databaseRelationshipHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.database}
      >
        <RelationshipMap
          nodes={tables.map((table) => ({
            id: table.table_name ?? table.name,
            title: table.name,
            subtitle: table.description || table.table_name || labels.noTableDescription,
            badge: <StatusBadge label={`${table.fields?.length ?? 0} ${labels.fields}`} tone="muted" />,
            tone: "accent" as const,
          }))}
          edges={allRelationships.map((relationship) => ({
            from: relationship.from ?? relationship.field ?? "",
            to: relationship.to ?? relationship.target ?? "",
            label: relationship.type,
          })).filter((edge) => edge.from && edge.to)}
          emptyText={labels.noDatabaseTables}
        />
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label={labels.entityFields}
            hint={labels.entityFieldsHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.workflow}
      >
        <div className="space-y-4">
          {tables.length > 0 ? (
            tables.map((table, index) => (
              <section key={`${table.table_name ?? table.name}-${index}`} className="space-y-4 rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">{table.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{table.description || labels.noTableDescription}</p>
                  </div>
                  {table.table_name ? <Badge variant="outline">{table.table_name}</Badge> : null}
                </div>
                <FieldTable fields={Array.isArray(table.fields) ? table.fields : []} />
                <div className="grid gap-3 xl:grid-cols-3">
                  <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                    <p className="text-sm font-medium text-muted-foreground">{labels.tableRelationships}</p>
                    <RelationshipList relationships={Array.isArray(table.relationships) ? table.relationships : []} />
                  </div>
                  <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                    <p className="text-sm font-medium text-muted-foreground">{labels.tableIndexes}</p>
                    <IndexList indexes={Array.isArray(table.indexes) ? table.indexes : []} />
                  </div>
                  <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                    <p className="text-sm font-medium text-muted-foreground">{labels.migrationNotes}</p>
                    <TextChips values={Array.isArray(table.migration_notes) ? table.migration_notes : []} emptyText={labels.noMigrationNotes} />
                  </div>
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{labels.noDatabaseTables}</p>
          )}
        </div>
      </VisualSection>

      <div className="grid gap-4 xl:grid-cols-3">
        <VisualSection title={labels.globalRelationships} icon={visualIcons.branch}>
          <RelationshipList relationships={relationships} />
        </VisualSection>
        <VisualSection title={labels.globalIndexes} icon={visualIcons.dot}>
          <IndexList indexes={indexes} />
        </VisualSection>
        <VisualSection title={labels.migrationNotes} icon={visualIcons.workflow}>
          <TextChips values={migrationNotes} emptyText={labels.noMigrationNotes} />
        </VisualSection>
      </div>

    </div>
  );
}

function LegacyDatabaseModelContentView({ content }: { content: DbModelContent }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          {t.designAssets.viewer.legacyDatabase}
        </AlertDescription>
      </Alert>
      <AssetContentSections content={content as Record<string, unknown>} sections={databaseModelLegacySections} />
    </div>
  );
}

export function DatabaseModelContentViewer({ content }: { content: DbModelContent }) {
  if (isNewDbModelContent(content)) {
    return <NewDatabaseModelContentView content={content} />;
  }

  return <LegacyDatabaseModelContentView content={content} />;
}
