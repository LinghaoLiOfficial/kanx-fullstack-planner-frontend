import type { LucideIcon } from "lucide-react";
import {
  Braces,
  ClipboardCheck,
  Code2,
  Database,
  DraftingCompass,
  FileText,
  ListChecks,
  Palette,
  ScrollText,
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
      { labelKey: "changeSets", segment: "change-sets", icon: ScrollText },
    ],
  },
  {
    labelKey: "assets",
    items: [
      { labelKey: "uxDesign", segment: "ux-design", icon: DraftingCompass },
      { labelKey: "uiDesign", segment: "ui-design", icon: Palette },
      { labelKey: "frontendImplementation", segment: "frontend-implementation", icon: Code2 },
      { labelKey: "apiContract", segment: "api-contract", icon: Braces },
      { labelKey: "backendImplementation", segment: "backend-implementation", icon: Code2 },
      { labelKey: "databaseModel", segment: "database-model", icon: Database },
    ],
  },
  {
    labelKey: "delivery",
    items: [
      { labelKey: "delivery", segment: "delivery", icon: ScrollText },
      { labelKey: "consistency", segment: "consistency", icon: ClipboardCheck },
    ],
  },
];

export function getProjectNavHref(projectId: string, segment: string) {
  return segment ? `/projects/${projectId}/${segment}` : `/projects/${projectId}`;
}

export function getProjectNavItems() {
  return projectNavGroups.flatMap((group) => group.items);
}
