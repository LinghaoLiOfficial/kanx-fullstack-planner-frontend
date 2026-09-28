import { Database } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { JsonViewer } from "@/components/common/JsonViewer";
import { EntityTable } from "@/components/db-model/EntityTable";
import { IndexList, RelationshipList } from "@/components/db-model/RelationshipList";
import { useLanguage } from "@/components/language/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DbModelDraft, LegacyDbModelContent } from "@/lib/types/db-model";

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function DbModelViewer({ model }: { model: DbModelDraft | null }) {
  const { locale, t } = useLanguage();

  if (!model) {
    return (
      <EmptyState
        icon={Database}
        title={t.designAssets.pages.databaseModel.title}
        description={t.designAssets.pages.databaseModel.emptyDescription}
      />
    );
  }

  const content = model.content as LegacyDbModelContent;
  const database = content.database;
  const entities = Array.isArray(content.entities) ? content.entities : [];
  const relationships = Array.isArray(content.relationships) ? content.relationships : [];
  const indexes = Array.isArray(content.indexes) ? content.indexes : [];
  const migrationNotes = Array.isArray(content.migration_notes) ? content.migration_notes : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{model.title}</CardTitle>
              <CardDescription>{model.summary}</CardDescription>
            </div>
            <Badge>v{model.version}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground md:grid-cols-4">
          <div>{t.common.createdAt}: {formatDate(model.created_at, locale)}</div>
          <div>Engine: {database?.engine || t.common.unspecified}</div>
          <div>ORM: {database?.orm || t.common.unspecified}</div>
          <div>Migration: {database?.migration_tool || t.common.unspecified}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entities</CardTitle>
          <CardDescription>{t.designAssets.viewer.entityFieldsHint}</CardDescription>
        </CardHeader>
        <CardContent>
          <EntityTable entities={entities} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <RelationshipList relationships={relationships} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Indexes</CardTitle>
          </CardHeader>
          <CardContent>
            <IndexList indexes={indexes} />
          </CardContent>
        </Card>
      </div>

      {migrationNotes.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Migration Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm leading-7 text-muted-foreground">
              {migrationNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <JsonViewer data={model} title={`${t.designAssets.pages.databaseModel.title} ${t.designAssets.versions.fullJson}`} />
    </div>
  );
}
