export type BusinessStoryPriority =
  | "p1_must"
  | "p2_should"
  | "p3_could"
  | "p4_wont";

export type BusinessStoryStatus =
  | "draft"
  | "ready"
  | "selected"
  | "applied"
  | "implemented"
  | "verified"
  | "in_progress"
  | "done"
  | "deferred";

export type ImplementationScope =
  | "frontend_only"
  | "backend_only"
  | "fullstack"
  | "non_code";

export type AffectedLayer =
  | "ux_design"
  | "ui_design"
  | "frontend_implementation"
  | "frontend_tools"
  | "api_contract"
  | "backend_implementation"
  | "backend_tools"
  | "database_model"
  | "db_model"
  | "frontend_pages"
  | "backend_services"
  | "database_models"
  | "project_blueprint"
  | "prompt_pack"
  | "prompt_assets"
  | "documentation";

export type BusinessScope = {
  included: string[];
  excluded: string[];
};

export type ImpactScope = {
  implementation_scope: ImplementationScope;
  affected_layers: AffectedLayer[];
};

export type DataRule = {
  field?: string;
  rule: string;
};

export type BusinessRequirementFieldKey =
  | "agile_business_requirements"
  | "requirement_overview"
  | "business_requirement_pool"
  | "business_requirement_story"
  | "requirement_name"
  | "impact_scope"
  | "user_story"
  | "business_scope"
  | "included_scope"
  | "excluded_scope"
  | "execution_note"
  | "data_rules"
  | "acceptance_criteria";

export type BusinessRequirementFieldDefinition = {
  key: BusinessRequirementFieldKey;
  name: string;
  englishName: BusinessRequirementFieldKey;
  meaning: string;
  parentKey?: BusinessRequirementFieldKey;
};

export type BusinessRequirementStory = {
  id: string;
  project_id: string;
  requirement_id?: string | null;
  generation_run_id?: string | null;
  execution_generation_run_id?: string | null;
  source_story_id?: string | null;
  title: string;
  priority: BusinessStoryPriority;
  status: BusinessStoryStatus;
  is_current?: boolean;
  applied_at?: string | null;
  applied_change_set_id?: string | null;
  implementation_scope: ImplementationScope;
  affected_layers: AffectedLayer[];
  user_story: string;
  business_scope: BusinessScope;
  requirement_name?: string;
  impact_scope?: ImpactScope;
  included_scope?: string[];
  excluded_scope?: string[];
  execution_note?: string | null;
  data_rules: DataRule[];
  acceptance_criteria: string[];
  depends_on?: string[];
  source_requirement_ids?: string[];
  execution_notes?: string | null;
  vertical_slice_note?: string | null;
  source_requirement_excerpt?: string | null;
  sort_order?: number;
  created_at: string;
  updated_at: string;
};

export type GenerateBusinessStoriesInput = {
  requirement_id?: string | null;
  overwrite?: boolean;
};

export type GenerateBusinessStoriesResponse = {
  items: BusinessRequirementStory[];
};

export type UpdateBusinessStoryInput = Partial<{
  title: string;
  priority: BusinessStoryPriority;
  status: BusinessStoryStatus;
  implementation_scope: ImplementationScope;
  affected_layers: AffectedLayer[];
  user_story: string;
  business_scope: BusinessScope;
  data_rules: DataRule[];
  acceptance_criteria: string[];
  depends_on: string[];
  source_requirement_ids: string[];
  execution_notes: string | null;
}>;
