export type ContextPack = {
  id: string;
  project_id: string;
  blueprint_id: string | null;
  api_contract_id: string | null;
  db_model_id: string | null;
  role: string;
  title: string;
  summary: string;
  content: Record<string, unknown>;
  prompt_text: string;
  format: string;
  created_at: string;
  updated_at: string;
};

export type ContextPackExport = {
  filename: string;
  content_type: string;
  content: string;
};
