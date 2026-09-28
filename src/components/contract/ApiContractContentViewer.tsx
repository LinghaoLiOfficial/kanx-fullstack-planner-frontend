import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ApiContractViewer } from "@/components/contract/ApiContractViewer";
import { useLanguage } from "@/components/language/language-provider";
import {
  MetricStrip,
  RelationshipMap,
  SchemaPanel,
  StatusBadge,
  VisualSection,
  visualIcons,
} from "@/components/design-assets/visual-dashboard";
import { FieldHint } from "@/components/ui/field-hint";
import {
  isNewApiContractContent,
  type ApiContractDraft,
  type ApiEndpoint,
  type NewApiContractContent,
} from "@/lib/types/api-contract";
import { cn } from "@/lib/utils";

function methodClassName(method: string) {
  return {
    GET: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300",
    POST: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
    PATCH: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
    PUT: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
    DELETE: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
  }[method.toUpperCase()] ?? "";
}

function optionalString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function ErrorMatrix({ endpoint }: { endpoint: ApiEndpoint }) {
  const { t } = useLanguage();

  if (endpoint.error_model.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{t.designAssets.viewer.noErrorModel}</p>;
  }

  return (
    <div className="grid gap-2 md:grid-cols-2">
      {endpoint.error_model.map((errorCase, index) => (
        <div key={`${errorCase.error_code}-${index}`} className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={errorCase.status_code} tone={errorCase.status_code >= 500 ? "error" : "warning"} />
            <code className="text-xs text-muted-foreground">{errorCase.error_code}</code>
          </div>
          <p className="mt-2 text-sm leading-6">{errorCase.error_message}</p>
          {errorCase.recovery_suggestion ? (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{errorCase.recovery_suggestion}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function NewApiContractContentView({ contract, content }: { contract: ApiContractDraft; content: NewApiContractContent }) {
  const { t } = useLanguage();
  const labels = t.designAssets.viewer;
  const groups = Array.isArray(content.api_resource_groups) ? content.api_resource_groups : [];
  const endpoints = groups.flatMap((group) => group.endpoints);
  const authCount = endpoints.filter((endpoint) => endpoint.requires_auth).length;
  const errorCount = endpoints.reduce((sum, endpoint) => sum + endpoint.error_model.length, 0);
  const methodCounts = endpoints.reduce<Record<string, number>>((counts, endpoint) => {
    counts[endpoint.http_method] = (counts[endpoint.http_method] ?? 0) + 1;
    return counts;
  }, {});

  return (
    <div className="space-y-4">
      <MetricStrip
        items={[
          { label: labels.resourceGroups, value: groups.length, description: content.api_base_path || contract.base_path },
          { label: labels.endpoints, value: endpoints.length, description: Object.entries(methodCounts).map(([method, count]) => `${method} ${count}`).join(" · ") || labels.noEndpoints },
          { label: labels.authRequired, value: authCount, description: "requires_auth=true" },
          { label: labels.errorScenarios, value: errorCount, description: optionalString(content.version_summary, contract.summary) },
        ]}
      />

      <VisualSection
        title={
          <FieldHint
            label={labels.apiTopology}
            hint={optionalString(contract.summary, labels.noApiSummary)}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.route}
      >
        <RelationshipMap
          nodes={[
            ...groups.map((group) => ({
              id: `group:${group.group_name}`,
              title: group.group_name,
              subtitle: group.group_purpose,
              badge: <StatusBadge label={`${group.endpoints.length} ${labels.endpoints}`} tone="muted" />,
              tone: "accent" as const,
            })),
            ...groups.flatMap((group) =>
              group.endpoints.map((endpoint) => ({
                id: `endpoint:${group.group_name}:${endpoint.http_method}:${endpoint.endpoint_path}`,
                title: endpoint.endpoint_path,
                subtitle: endpoint.endpoint_purpose,
                badge: <Badge variant="outline" className={methodClassName(endpoint.http_method)}>{endpoint.http_method}</Badge>,
              }))
            ),
          ]}
          edges={groups.flatMap((group) =>
            group.endpoints.map((endpoint) => ({
              from: `group:${group.group_name}`,
              to: `endpoint:${group.group_name}:${endpoint.http_method}:${endpoint.endpoint_path}`,
              label: endpoint.requires_auth ? labels.authRequired : labels.public,
            }))
          )}
          emptyText={labels.noApiResources}
        />
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label="Endpoint Dashboard"
            hint={labels.endpointDashboardHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.workflow}
      >
        <div className="space-y-4">
          {groups.length > 0 ? (
            groups.map((group, groupIndex) => (
              <section key={`${group.group_name}-${groupIndex}`} className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">{group.group_name}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{group.group_purpose}</p>
                  </div>
                  <StatusBadge label={`${group.endpoints.length} ${labels.endpoints}`} tone="muted" />
                </div>
                <div className="space-y-3">
                  {group.endpoints.length > 0 ? (
                    group.endpoints.map((endpoint, endpointIndex) => (
                      <section key={`${endpoint.http_method}-${endpoint.endpoint_path}-${endpointIndex}`} className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <Badge variant="outline" className={cn("shrink-0", methodClassName(endpoint.http_method))}>{endpoint.http_method}</Badge>
                            <code className="break-all text-xs">{endpoint.endpoint_path}</code>
                          </div>
                          <StatusBadge label={endpoint.requires_auth ? labels.authRequired : labels.public} tone={endpoint.requires_auth ? "default" : "muted"} />
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">{endpoint.endpoint_purpose}</p>
                        <div className="grid gap-3 xl:grid-cols-2">
                          <SchemaPanel title={labels.requestSchema} value={endpoint.request_schema} />
                          <SchemaPanel title={labels.responseSchema} value={endpoint.response_schema} />
                        </div>
                        <ErrorMatrix endpoint={endpoint} />
                      </section>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-muted-foreground">{labels.noEndpoints}</p>
                  )}
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{labels.noApiResourceGroups}</p>
          )}
        </div>
      </VisualSection>

    </div>
  );
}

function LegacyApiContractContentView({ contract }: { contract: ApiContractDraft }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          {t.designAssets.viewer.legacyApi}
        </AlertDescription>
      </Alert>
      <ApiContractViewer contract={contract} />
    </div>
  );
}

export function ApiContractContentViewer({ contract }: { contract: ApiContractDraft }) {
  if (isNewApiContractContent(contract.content)) {
    return <NewApiContractContentView contract={contract} content={contract.content} />;
  }

  return <LegacyApiContractContentView contract={contract} />;
}
