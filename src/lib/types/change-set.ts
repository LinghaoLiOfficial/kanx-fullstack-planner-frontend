import type { AffectedLayer, ImplementationScope } from "@/lib/types/business-story";
import type { ModuleChangeGroup } from "@/lib/types/design-asset";

export type ChangeSetStatus =
  | "draft"
  | "ready"
  | "applied"
  | "discarded"
  | "failed";

export type ChangeSet = {
  id: string;
  project_id: string;
  version: number;
  batch_id?: string | null;
  layer?: AffectedLayer | string | null;
  source_story_id?: string | null;
  source_requirement_id?: string | null;
  title: string;
  status: ChangeSetStatus;
  is_current?: boolean;
  applied_at?: string | null;
  implementation_scope: ImplementationScope;
  affected_layers: AffectedLayer[];
  impact_summary: string;
  module_changes: {
    ux_design?: ModuleChangeGroup;
    ui_design?: ModuleChangeGroup;
    frontend_implementation?: ModuleChangeGroup;
    frontend_pages?: ModuleChangeGroup;
    frontend_tools?: ModuleChangeGroup;
    api_contract?: ModuleChangeGroup;
    backend_implementation?: ModuleChangeGroup;
    backend_services?: ModuleChangeGroup;
    backend_tools?: ModuleChangeGroup;
    database_model?: ModuleChangeGroup;
    db_model?: ModuleChangeGroup;
    database_models?: ModuleChangeGroup;
  };
  risks: string[];
  open_questions: string[];
  recommended_prompt_strategy: {
    generate_frontend_prompt: boolean;
    generate_backend_prompt: boolean;
    reason: string;
  };
  content: unknown;
  created_at: string;
  updated_at: string;
};
