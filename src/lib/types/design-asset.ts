export type ModuleChangeValue = string | number | boolean | Record<string, unknown> | unknown[] | null;

export type ModuleChangeItem = {
  field?: string | null;
  selector?: Record<string, unknown>;
  before?: ModuleChangeValue;
  after?: ModuleChangeValue;
  reason?: string | null;
  constraints?: unknown[];
  dependencies?: unknown[];
  acceptance_criteria?: unknown[];
  [key: string]: unknown;
};

export type ModuleChangeEntry = ModuleChangeItem | string;

export type ModuleChangeGroup<T = ModuleChangeEntry> = {
  added: T[];
  modified: T[];
  removed: T[];
};

export type VersionedAssetDiff = {
  added?: unknown[];
  modified?: unknown[];
  removed?: unknown[];
} | null;

export type VersionedDesignAsset<TContent = unknown> = {
  id: string;
  project_id: string;
  version: number;
  is_current?: boolean;
  title: string;
  summary?: string | null;
  content: TContent;
  diff_from_previous?: VersionedAssetDiff;
  source_requirement_id?: string | null;
  source_story_id?: string | null;
  change_set_id?: string | null;
  generation_run_id?: string | null;
  created_at: string;
  updated_at: string;
};
