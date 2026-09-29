import type { LucideIcon } from "lucide-react";
import {
  FileText,
  ListChecks,
  Settings2,
} from "lucide-react";

export type ProjectNavItem = {
  labelKey:
    | "configuration"
    | "rawRequirements"
    | "businessRequirements"
    | "changeSets"
    | "uxDesign"
    | "uiDesign"
    | "frontendImplementation"
    | "apiContract"
    | "backendImplementation"
    | "databaseModel"
    | "delivery"
    | "consistency";
  segment: string;
  icon: LucideIcon;
};

export type ProjectNavGroup = {
  labelKey: "constraints" | "requirements" | "assets" | "delivery";
  items: ProjectNavItem[];
};

export const projectNavGroups: ProjectNavGroup[] = [
  {
    labelKey: "constraints",
    items: [
      { labelKey: "configuration", segment: "configuration", icon: Settings2 },
    ],
  },
  {
    labelKey: "requirements",
    items: [
      { labelKey: "rawRequirements", segment: "raw-requirements", icon: FileText },
      { labelKey: "businessRequirements", segment: "business-requirements", icon: ListChecks },
    ],
  },
];

export function getProjectNavHref(projectId: string, segment: string) {
  return segment ? `/projects/${projectId}/${segment}` : `/projects/${projectId}`;
}

export function getProjectNavItems() {
  return projectNavGroups.flatMap((group) => group.items);
}
