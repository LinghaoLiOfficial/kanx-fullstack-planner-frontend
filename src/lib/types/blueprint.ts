export type ProjectBlueprint = {
  id: string;
  project_id: string;
  version: number;
  title: string;
  summary: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};
