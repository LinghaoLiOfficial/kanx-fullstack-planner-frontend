export type AdminLLMTask = {
  id: string;
  project_id: string;
  project_name: string;
  user_id: string;
  username: string;
  status: string;
  progress: number;
  completed_steps: number;
  total_steps: number;
  job_id: string | null;
  job_attempt: number | null;
  created_at: string;
  updated_at: string;
};

export type AdminLLMTaskDetail = AdminLLMTask & {
  error: string | null;
  raw_text: string;
  project_context: Record<string, unknown>;
  steps: Array<{
    key: string;
    status: string;
    attempt: number;
    started_at: string | null;
    finished_at: string | null;
    error: string | null;
  }>;
  invocations: Array<{
    id: string;
    invocation_id: string | null;
    task_name: string;
    call_index: number | null;
    subject: { key?: string; label?: string } | null;
    attempt: number;
    max_attempts: number | null;
    call_type: string | null;
    status: string;
    model: string;
    latency_ms: number | null;
    created_at: string;
    finished_at: string | null;
    input_hash: string;
    output_hash: string | null;
    input: unknown;
    output: unknown;
    control: Record<string, unknown> | null;
    system_prompt: string | null;
    user_prompt: string | null;
    error: string | null;
  }>;
  findings: Array<{ severity: string; code: string; message: string }>;
};

export type AdminLLMTaskPage = {
  items: AdminLLMTask[];
  total: number;
  page: number;
  page_size: number;
};
