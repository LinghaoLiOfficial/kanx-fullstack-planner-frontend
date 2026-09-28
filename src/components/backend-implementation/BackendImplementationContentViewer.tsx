"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import {
  KeyValueTable,
  MetricStrip,
  RelationshipMap,
  StatusBadge,
  TextChips,
  VisualSection,
  visualIcons,
} from "@/components/design-assets/visual-dashboard";
import { FieldHint } from "@/components/ui/field-hint";
import { useLanguage } from "@/components/language/language-provider";
import {
  isNewBackendImplementationContent,
  type BackendImplementationContent,
  type NewBackendImplementationContent,
} from "@/lib/types/backend-implementation";
import { backendImplementationLegacySections } from "@/lib/backend-implementation-contract";

function RequiredBadge({ value }: { value: boolean | undefined }) {
  const { t } = useLanguage();
  return <Badge variant={value === false ? "secondary" : "outline"}>{value === false ? t.common.optional : t.common.required}</Badge>;
}

function NewBackendImplementationContentView({ content }: { content: NewBackendImplementationContent }) {
  const { t } = useLanguage();
  const labels = t.designAssets.viewer;
  const directoryStructure = content.directory_structure ?? [];
  const codeLogic = content.code_logic ?? [];
  const utilityClasses = content.utility_classes ?? [];
  const llmTemplates = content.llm_interaction_templates ?? [];
  const environmentVariables = content.environment_variables ?? [];
  const dependencies = content.dependencies ?? [];

  return (
    <div className="space-y-4">
      <MetricStrip
        items={[
          { label: labels.directoryItems, value: directoryStructure.length, description: labels.backendFilesDescription },
          { label: labels.serviceLogic, value: codeLogic.length, description: labels.backendLogicDescription },
          { label: `${labels.utilityClasses} / ${labels.llmTemplates}`, value: `${utilityClasses.length} / ${llmTemplates.length}`, description: labels.backendUtilityDescription },
          { label: labels.dependenciesAndEnv, value: `${dependencies.length} / ${environmentVariables.length}`, description: content.version_summary },
        ]}
      />

      <VisualSection
        title={
          <FieldHint
            label={labels.backendDirectory}
            hint={labels.backendDirectoryHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.workflow}
      >
        <div className="space-y-3">
          {directoryStructure.length > 0 ? (
            directoryStructure.map((entry, index) => (
              <section key={`${entry.path}-${index}`} className="rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-mono text-xs text-muted-foreground">{entry.path}</p>
                  <StatusBadge label={labels.directoryItem} tone="muted" />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.purpose}</p>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{labels.noDirectoryStructure}</p>
          )}
        </div>
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label={labels.serviceLogicMatrix}
            hint={labels.serviceLogicHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.branch}
      >
        <div className="space-y-3">
          {codeLogic.length > 0 ? (
            codeLogic.map((logic, index) => (
              <section key={`${logic.target}-${index}`} className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{logic.target}</h3>
                  <StatusBadge label={labels.serviceLogic} tone="muted" />
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{labels.serviceFlow}</p>
                    <TextChips values={Array.isArray(logic.service_flow) ? logic.service_flow : []} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{labels.validationLogic}</p>
                    <TextChips values={Array.isArray(logic.validation_logic) ? logic.validation_logic : []} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{labels.transactionHandling}</p>
                    <TextChips values={Array.isArray(logic.transaction_handling) ? logic.transaction_handling : []} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{labels.errorHandling}</p>
                    <TextChips values={Array.isArray(logic.error_handling) ? logic.error_handling : []} />
                  </div>
                </div>
              </section>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{labels.noCodeLogic}</p>
          )}
        </div>
      </VisualSection>

      <div className="grid gap-4 xl:grid-cols-2">
        <VisualSection title={labels.utilityClasses} icon={visualIcons.dot}>
          <div className="space-y-3">
            {utilityClasses.length > 0 ? (
              utilityClasses.map((utility, index) => (
                <section key={`${utility.name}-${index}`} className="rounded-lg border border-border/70 bg-background/70 p-4">
                  <h3 className="text-sm font-semibold">{utility.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{utility.purpose}</p>
                  <div className="mt-3">
                    <TextChips values={Array.isArray(utility.usage) ? utility.usage : []} emptyText={labels.noUsageScenarios} />
                  </div>
                </section>
              ))
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">{labels.noUtilityClasses}</p>
            )}
          </div>
        </VisualSection>
        <VisualSection title={labels.llmTemplates} icon={visualIcons.workflow}>
          <div className="space-y-3">
            {llmTemplates.length > 0 ? (
              llmTemplates.map((template, index) => (
                <section key={`${template.template_name}-${index}`} className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
                  <h3 className="text-sm font-semibold">{template.template_name}</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{labels.inputStructure}</p>
                      <TextChips values={Array.isArray(template.input_structure) ? template.input_structure : []} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{labels.outputStructure}</p>
                      <TextChips values={Array.isArray(template.output_structure) ? template.output_structure : []} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{labels.parsingRules}</p>
                      <TextChips values={Array.isArray(template.parsing_rules) ? template.parsing_rules : []} />
                    </div>
                  </div>
                </section>
              ))
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">{labels.noLlmTemplates}</p>
            )}
          </div>
        </VisualSection>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <VisualSection title={labels.environmentVariables} icon={visualIcons.dot}>
          {environmentVariables.length > 0 ? (
            <KeyValueTable
              rows={environmentVariables.map((variable) => ({
                key: variable.name,
                value: variable.purpose,
                meta: <RequiredBadge value={variable.required} />,
              }))}
              columns={[labels.variableName, labels.purpose, t.common.required]}
            />
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{labels.noEnvironmentVariables}</p>
          )}
        </VisualSection>
        <VisualSection title={labels.dependencies} icon={visualIcons.branch}>
          {dependencies.length > 0 ? (
            <KeyValueTable
              rows={dependencies.map((dependency) => ({
                key: dependency.package_name,
                value: dependency.purpose,
                meta: <RequiredBadge value={dependency.required} />,
              }))}
              columns={[labels.packageName, labels.purpose, t.common.required]}
            />
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{labels.noDependencies}</p>
          )}
        </VisualSection>
      </div>

      <VisualSection title={labels.backendModuleMap} icon={visualIcons.route}>
        <RelationshipMap
          nodes={[
            ...codeLogic.map((logic) => ({
              id: `logic:${logic.target}`,
              title: logic.target,
              subtitle: labels.serviceLogic,
              badge: <StatusBadge label={labels.service} />,
              tone: "accent" as const,
            })),
            ...utilityClasses.map((utility) => ({
              id: `utility:${utility.name}`,
              title: utility.name,
              subtitle: utility.purpose,
              badge: <StatusBadge label={labels.utility} tone="muted" />,
            })),
          ]}
          emptyText={labels.noBackendModuleMap}
        />
      </VisualSection>

    </div>
  );
}

function LegacyBackendImplementationContentView({ content }: { content: BackendImplementationContent }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          {t.designAssets.viewer.legacyBackend}
        </AlertDescription>
      </Alert>
      <AssetContentSections content={content as Record<string, unknown>} sections={backendImplementationLegacySections} />
    </div>
  );
}

export function BackendImplementationContentViewer({ content }: { content: BackendImplementationContent }) {
  if (isNewBackendImplementationContent(content)) {
    return <NewBackendImplementationContentView content={content} />;
  }

  return <LegacyBackendImplementationContentView content={content} />;
}
