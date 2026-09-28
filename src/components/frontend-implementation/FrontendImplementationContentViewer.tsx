import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language/language-provider";
import { MetricStrip, StatusBadge, TextChips, VisualSection, visualIcons } from "@/components/design-assets/visual-dashboard";
import type { FrontendImplementationContent } from "@/lib/types/frontend-implementation";

function BlockList({ title, values, emptyText }: { title: string; values: string[]; emptyText: string }) {
  if (values.length === 0) {
    return (
      <section className="space-y-2 rounded-lg border border-border/70 bg-background/70 p-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{emptyText}</p>
      </section>
    );
  }

  return (
    <section className="space-y-2 rounded-lg border border-border/70 bg-background/70 p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <Badge key={`${value}-${index}`} variant="outline" className="max-w-full whitespace-normal bg-transparent leading-5">
            {value}
          </Badge>
        ))}
      </div>
    </section>
  );
}

export function FrontendImplementationContentViewer({ content }: { content: FrontendImplementationContent }) {
  const { t } = useLanguage();
  const labels = t.designAssets.viewer;
  const environmentVariables = content.environment_variables ?? [];
  const routeDefinitions = content.route_definitions ?? [];
  const directoryStructure = content.directory_structure ?? [];
  const dependencyPackageManagement = content.dependency_package_management ?? [];
  const pageCodeLogic = content.page_code_logic ?? [];
  const frontendInterfaces = content.frontend_interfaces ?? [];
  const layoutLibrary = typeof content.layout_library === "string" ? content.layout_library : "";
  const componentLibrary = typeof content.component_library === "string" ? content.component_library : "";

  return (
    <div className="space-y-4">
      <MetricStrip
        items={[
          { label: labels.routes, value: routeDefinitions.length, description: labels.routeDefinitions },
          { label: labels.directoryItems, value: directoryStructure.length, description: labels.suggestedFileStructure },
          { label: labels.logicItems, value: pageCodeLogic.length, description: labels.stateEventsDataFlow },
          { label: labels.dependenciesAndEnv, value: `${dependencyPackageManagement.length} / ${environmentVariables.length}`, description: content.version_summary ?? labels.noDependencies },
        ]}
      />

      <VisualSection title={labels.environmentVariables} icon={visualIcons.dot}>
        {environmentVariables.length > 0 ? (
          <div className="space-y-3">
            {environmentVariables.map((variable, index) => (
              <section key={`${variable.variable_name}-${index}`} className="rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{variable.variable_name}</h3>
                  <StatusBadge label={variable.default_value} tone="muted" />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{variable.variable_description}</p>
              </section>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">{labels.noEnvironmentVariables}</p>
        )}
      </VisualSection>

      <VisualSection title={labels.routeDefinitions} icon={visualIcons.route}>
        {routeDefinitions.length > 0 ? (
          <div className="space-y-3">
            {routeDefinitions.map((route, index) => (
              <section key={`${route.route_path}-${index}`} className="space-y-3 rounded-lg border border-border/70 bg-background/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold">{route.route_name}</h3>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{route.route_path}</p>
                  </div>
                  <StatusBadge label={route.route_target_component} tone="muted" />
                </div>
                <TextChips values={Array.isArray(route.route_params) ? route.route_params : []} emptyText={labels.noDynamicParams} />
              </section>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">{labels.noRouteDefinitions}</p>
        )}
      </VisualSection>

      <div className="grid gap-4 xl:grid-cols-2">
        <VisualSection title={labels.directoryStructure} icon={visualIcons.workflow}>
          {directoryStructure.length > 0 ? (
            <div className="space-y-3">
              {directoryStructure.map((entry, index) => (
                <section key={`${entry.path}-${index}`} className="rounded-lg border border-border/70 bg-background/70 p-4">
                  <p className="font-mono text-xs text-muted-foreground">{entry.path}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.purpose}</p>
                </section>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{labels.noDirectoryStructure}</p>
          )}
        </VisualSection>
        <VisualSection title={labels.dependencies} icon={visualIcons.branch}>
          {dependencyPackageManagement.length > 0 ? (
            <div className="space-y-3">
              {dependencyPackageManagement.map((dependency, index) => (
                <section key={`${dependency.package_name}-${index}`} className="rounded-lg border border-border/70 bg-background/70 p-4">
                  <h3 className="text-sm font-semibold">{dependency.package_name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{dependency.package_description}</p>
                </section>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">{labels.noDependencies}</p>
          )}
        </VisualSection>
      </div>

      <VisualSection title={labels.codeLogic} icon={visualIcons.branch}>
        {pageCodeLogic.length > 0 ? (
          <div className="space-y-3">
            {pageCodeLogic.map((logic, index) => (
              <section key={`${logic.target}-${index}`} className="rounded-lg border border-border/70 bg-background/70 p-4">
                <h3 className="text-sm font-semibold">{logic.target}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{logic.logic_description}</p>
              </section>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">{labels.noCodeLogic}</p>
        )}
      </VisualSection>

      <div className="grid gap-4 xl:grid-cols-2">
        <VisualSection title="布局库" icon={visualIcons.route}>
          <BlockList title="布局库" values={layoutLibrary ? [layoutLibrary] : []} emptyText={labels.noRoutesOrLogic} />
        </VisualSection>
        <VisualSection title="组件库" icon={visualIcons.workflow}>
          <BlockList title="组件库" values={componentLibrary ? [componentLibrary] : []} emptyText={labels.noRoutesOrLogic} />
        </VisualSection>
      </div>

      <VisualSection title="前端接口" icon={visualIcons.route}>
        {frontendInterfaces.length > 0 ? (
          <div className="space-y-3">
            {frontendInterfaces.map((item, index) => (
              <section key={`${item.interface_name}-${index}`} className="rounded-lg border border-border/70 bg-background/70 p-4">
                <h3 className="text-sm font-semibold">{item.interface_name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.interface_description}</p>
              </section>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">{labels.noRoutesOrLogic}</p>
        )}
      </VisualSection>
    </div>
  );
}
