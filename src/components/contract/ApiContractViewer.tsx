import { Code2 } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { JsonViewer } from "@/components/common/JsonViewer";
import { EndpointTable } from "@/components/contract/EndpointTable";
import { SchemaList } from "@/components/contract/SchemaList";
import { useLanguage } from "@/components/language/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiContractDraft, LegacyApiContractContent } from "@/lib/types/api-contract";

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ApiContractViewer({ contract }: { contract: ApiContractDraft | null }) {
  const { locale, t } = useLanguage();

  if (!contract) {
    return (
      <EmptyState
        icon={Code2}
        title={t.designAssets.pages.apiContract.title}
        description={t.designAssets.pages.apiContract.emptyDescription}
      />
    );
  }

  const resources = Array.isArray(contract.content.resources) ? contract.content.resources : [];
  const schemas = Array.isArray(contract.content.schemas) ? contract.content.schemas : [];
  const legacyContent = contract.content as LegacyApiContractContent;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{contract.title}</CardTitle>
              <CardDescription>{contract.summary}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>v{contract.version}</Badge>
              <Badge variant="outline">{contract.base_path || legacyContent.base_path}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{t.common.createdAt}: {formatDate(contract.created_at, locale)}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resources & Endpoints</CardTitle>
          <CardDescription>{t.designAssets.viewer.endpointDashboardHint}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {resources.map((resource) => (
            <section key={resource.name} className="space-y-3 rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
              <div>
                <h3 className="font-medium">{resource.name}</h3>
                {resource.description ? <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p> : null}
              </div>
              <EndpointTable endpoints={resource.endpoints} />
            </section>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schemas</CardTitle>
          <CardDescription>{t.designAssets.legacySections.schemas}</CardDescription>
        </CardHeader>
        <CardContent>
          <SchemaList schemas={schemas} />
        </CardContent>
      </Card>

      <JsonViewer data={contract} title={`${t.designAssets.pages.apiContract.title} ${t.designAssets.versions.fullJson}`} />
    </div>
  );
}
