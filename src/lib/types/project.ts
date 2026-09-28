import type { TechStackItem } from "@/lib/types/tech-stack";

export type LLMPromptLanguage = "zh-CN" | "en";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  target_frontend_stack?: string;
  target_backend_stack?: string;
  target_frontend_stack_items?: TechStackItem[];
  target_backend_stack_items?: TechStackItem[];
  target_stacks_configured: boolean;
  llm_prompt_language: LLMPromptLanguage;
  status: string;
  created_at: string;
  last_opened_at: string;
  updated_at: string;
};

export type CreateProjectPayload = {
  name: string;
  description?: string | null;
  llm_prompt_language?: LLMPromptLanguage;
};

export type ProjectDescriptionOption = {
  description: string;
};

export type ProjectDescriptionOptionsPayload = {
  name: string;
  llm_prompt_language?: LLMPromptLanguage;
};

export type ProjectDescriptionOptionsResponse = {
  options: ProjectDescriptionOption[];
};

export type UpdateProjectPayload = {
  name?: string | null;
  description?: string | null;
  status?: string | null;
  target_frontend_stack?: string;
  target_backend_stack?: string;
  target_frontend_stack_items?: TechStackItem[];
  target_backend_stack_items?: TechStackItem[];
  llm_prompt_language?: LLMPromptLanguage | null;
};
