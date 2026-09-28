import type { AffectedLayer, ImplementationScope } from "@/lib/types/business-story";
import type { ChangeSetStatus } from "@/lib/types/change-set";
import { dictionaries, type Locale } from "@/lib/i18n";

const zh = dictionaries["zh-CN"];

export const implementationScopeLabels: Record<ImplementationScope, string> = zh.designAssets.scopes;

export const affectedLayerLabels: Record<AffectedLayer, string> = zh.designAssets.layers;

export type BusinessStoryImpactScopeFilter =
  | ImplementationScope
  | "ux_design"
  | "ui_design"
  | "frontend_implementation"
  | "api_contract"
  | "backend_implementation"
  | "database_models";

export const businessStoryImpactScopeLabels: Record<BusinessStoryImpactScopeFilter, string> = {
  frontend_only: zh.designAssets.scopes.frontend_only,
  backend_only: zh.designAssets.scopes.backend_only,
  fullstack: zh.designAssets.scopes.fullstack,
  non_code: zh.designAssets.scopes.non_code,
  ux_design: zh.designAssets.layers.ux_design,
  ui_design: zh.designAssets.layers.ui_design,
  frontend_implementation: zh.designAssets.layers.frontend_implementation,
  api_contract: zh.designAssets.layers.api_contract,
  backend_implementation: zh.designAssets.layers.backend_implementation,
  database_models: zh.designAssets.layers.database_models,
};

export const businessStoryImpactScopeOptions: BusinessStoryImpactScopeFilter[] = [
  "frontend_only",
  "backend_only",
  "fullstack",
  "non_code",
  "ux_design",
  "ui_design",
  "frontend_implementation",
  "api_contract",
  "backend_implementation",
  "database_models",
];

export const changeSetStatusLabels: Record<ChangeSetStatus, string> = zh.designAssets.statuses;

export function getImplementationScopeLabel(scope: ImplementationScope, locale: Locale) {
  return dictionaries[locale].designAssets.scopes[scope] ?? scope;
}

export function getAffectedLayerLabel(layer: AffectedLayer | string, locale: Locale) {
  const labels = dictionaries[locale].designAssets.layers as Record<string, string>;
  return labels[layer] ?? layer;
}

export function getChangeSetStatusLabel(status: ChangeSetStatus, locale: Locale) {
  return dictionaries[locale].designAssets.statuses[status] ?? status;
}

export function getBusinessStoryImpactScopeLabel(scope: BusinessStoryImpactScopeFilter, locale: Locale) {
  if (scope in dictionaries[locale].designAssets.scopes) {
    return dictionaries[locale].designAssets.scopes[scope as ImplementationScope];
  }

  const labels = dictionaries[locale].designAssets.layers as Record<string, string>;
  return labels[scope] ?? scope;
}

export function formatDateTime(value?: string | null, locale: Locale = "zh-CN") {
  if (!value) {
    return locale === "en" ? "No time" : "暂无时间";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
