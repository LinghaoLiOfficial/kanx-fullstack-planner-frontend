import { Badge } from "@/components/ui/badge";
import { FieldHint } from "@/components/ui/field-hint";
import { useLanguage } from "@/components/language/language-provider";
import {
  FlowTimeline,
  MetricStrip,
  StatusBadge,
  TextChips,
  VisualSection,
  visualIcons,
} from "@/components/design-assets/visual-dashboard";
import type { UXBranchStatus, UXDesignContent, UXInvolvedElementReference } from "@/lib/types/ux-design";

function branchTone(status: UXBranchStatus) {
  if (status === "success") return "success";
  if (status === "error") return "error";
  if (status === "blocked" || status === "empty") return "warning";
  return "muted";
}

function statusLabel(status: UXBranchStatus, labels: ReturnType<typeof useLanguage>["t"]["designAssets"]["ux"]) {
  return {
    success: labels.success,
    error: labels.error,
    blocked: labels.blocked,
    empty: labels.emptyState,
    next_action: labels.nextAction,
  }[status] ?? status;
}

function MetricNameList({ names, emptyText }: { names: string[]; emptyText: string }) {
  if (names.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div className="max-h-24 overflow-y-auto pr-1">
      <div className="flex flex-col items-start gap-1.5">
        {names.map((name, index) => (
          <Badge key={`${name}-${index}`} variant="outline" className="max-w-full items-center justify-center bg-transparent px-2 py-0.5 text-center leading-5">
            {name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function InformationPriorityList({ values }: { values: string[] }) {
  const { t } = useLanguage();

  if (values.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{t.common.empty}</p>;
  }

  return (
    <ol className="grid grid-cols-[repeat(auto-fit,minmax(10rem,max-content))] gap-2">
      {values.map((value, index) => (
        <li key={`${value}-${index}`} className="flex min-h-11 max-w-80 items-center justify-center gap-2.5 rounded-lg border border-border/70 bg-background/70 px-3 py-2">
          <Badge variant="outline" className="flex h-5 shrink-0 items-center justify-center bg-transparent px-1.5 py-0 font-mono text-xs leading-none tabular-nums">
            P{index + 1}
          </Badge>
          <span className="min-w-0 text-center text-sm font-medium leading-6 text-foreground">
            {value}
          </span>
        </li>
      ))}
    </ol>
  );
}

function involvedElementText(reference: UXInvolvedElementReference) {
  return [reference.screen, reference.region, reference.element].filter(Boolean).join(" / ");
}

export function UXDesignContentViewer({ content }: { content: UXDesignContent }) {
  const { t } = useLanguage();
  const labels = t.designAssets.ux;
  const screens = content.low_fidelity_screen_structure ?? [];
  const flows = content.business_flows ?? [];
  const screenNames = screens.map((screen) => screen.screen_name || labels.unnamedScreen);
  const flowNames = flows.map((flow) => flow.flow_name || labels.unnamedFlow);

  return (
    <div className="space-y-4">
      <MetricStrip
        items={[
          {
            label: labels.screens,
            value: screens.length,
            description: <MetricNameList names={screenNames} emptyText={labels.noScreens} />,
          },
          {
            label: labels.businessFlows,
            value: flows.length,
            description: <MetricNameList names={flowNames} emptyText={labels.noBusinessFlows} />,
          },
        ]}
      />

      <VisualSection
        title={
          <FieldHint
            label={labels.lowFidelityStructure}
            hint={labels.lowFidelityHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.workflow}
        empty={screens.length === 0 ? labels.lowFidelityStructure : false}
      >
        <div className="grid gap-3">
          {screens.map((screen, screenIndex) => (
            <section key={`${screen.screen_name}-${screenIndex}`} className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h3 className="min-w-0 whitespace-normal break-words text-sm font-semibold">{screen.screen_name || labels.unnamedScreen}</h3>
                  <StatusBadge label={labels.regionCount(screen.interaction_regions?.length ?? 0)} tone="muted" />
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{screen.screen_purpose || labels.noScreenPurpose}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{labels.informationPriority}</p>
                <InformationPriorityList values={Array.isArray(screen.information_priority) ? screen.information_priority : []} />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {(screen.interaction_regions ?? []).map((region, regionIndex) => (
                  <div key={`${region.region_name}-${regionIndex}`} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                    <div className="text-sm font-medium">{region.region_name || labels.unnamedRegion}</div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{region.region_purpose || labels.noRegionPurpose}</p>
                    <div className="mt-3">
                      <TextChips values={Array.isArray(region.content_elements) ? region.content_elements : []} emptyText={labels.noContentElements} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </VisualSection>

      <VisualSection
        title={
          <FieldHint
            label={labels.businessLogicFlow}
            hint={labels.businessLogicFlowHint}
            labelClassName="text-base font-semibold leading-6"
          />
        }
        icon={visualIcons.branch}
        empty={flows.length === 0 ? labels.businessLogicFlow : false}
      >
        <div className="space-y-4">
          {flows.map((flow, flowIndex) => (
            <section key={`${flow.flow_name}-${flowIndex}`} className="space-y-4 rounded-lg border border-border/70 bg-background/70 p-4">
              <div>
                <h3 className="text-sm font-semibold">{flow.flow_name || labels.unnamedFlow}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{flow.flow_goal || labels.noFlowGoal}</p>
                <div className="mt-3 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge label={flow.primary_actor || labels.unspecifiedUser} tone="default" />
                  </div>
                  <TextChips values={Array.isArray(flow.preconditions) ? flow.preconditions : []} emptyText={labels.noPreconditions} />
                </div>
              </div>
              <FlowTimeline
                showConnectors={false}
                variant="dotLabel"
                steps={(flow.steps ?? []).map((step) => ({
                  title: labels.step(step.step_order),
                  meta: labels.step(step.step_order),
                  description: step.system_feedback || labels.noSystemFeedback,
                  details: (
                    <div className="space-y-3">
                      <TextChips
                        values={Array.isArray(step.involved_elements) ? step.involved_elements.map(involvedElementText) : []}
                        emptyText={labels.noInvolvedElements}
                      />
                      <div className="grid gap-2 md:grid-cols-2">
                        {(step.step_results ?? []).map((result, resultIndex) => (
                          <div key={`${result.branch_status}-${resultIndex}`} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusBadge label={statusLabel(result.branch_status, labels)} tone={branchTone(result.branch_status)} />
                              <span className="text-sm text-muted-foreground">{result.branch_description || labels.noBranchDescription}</span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.system_feedback || labels.noFeedback}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                }))}
              />
            </section>
          ))}
        </div>
      </VisualSection>
    </div>
  );
}
