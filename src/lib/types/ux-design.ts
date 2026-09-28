import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type UXBranchStatus = "success" | "error" | "blocked" | "empty" | "next_action";

export type UXWireframeRegion = {
  region_name: string;
  region_purpose: string;
  content_elements: string[];
};

export type UXScreen = {
  screen_name: string;
  screen_purpose: string;
  information_priority: string[];
  interaction_regions: UXWireframeRegion[];
};

export type UXFlowBranch = {
  branch_status: UXBranchStatus;
  branch_description: string;
  system_feedback: string;
};

export type UXInvolvedElementReference = {
  screen: string;
  region: string;
  element: string;
};

export type UXFlowStep = {
  step_order: number;
  system_feedback: string;
  involved_elements: UXInvolvedElementReference[];
  step_results: UXFlowBranch[];
};

export type UXBusinessFlow = {
  flow_name: string;
  flow_goal: string;
  primary_actor: string;
  preconditions: string[];
  steps: UXFlowStep[];
};

export type UXDesignContent = {
  version_summary: string;
  low_fidelity_screen_structure: UXScreen[];
  business_flows: UXBusinessFlow[];
  diff: {
    added: unknown[];
    modified: unknown[];
    removed: unknown[];
  };
};

export type UXDesign = VersionedDesignAsset<UXDesignContent>;
