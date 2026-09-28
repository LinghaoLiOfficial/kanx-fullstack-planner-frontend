export type GenerationRun = {
  id: string;
  project_id: string;
  requirement_id?: string | null;
  run_type: string;
  parent_run_id?: string | null;
  asset_layer?: string | null;
  queue_payload?: Record<string, unknown> | null;
  input_snapshot?: Record<string, unknown> | null;
  status: string;
  progress: number;
  message?: string | null;
  output_snapshot?: {
    child_run_ids?: string[];
    completed_layers?: string[];
    failed_layers?: string[];
    asset_ids?: Record<string, string>;
    change_set_ids?: string[];
    context_pack_ids?: string[];
    batch_id?: string | null;
  } | null;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
};
