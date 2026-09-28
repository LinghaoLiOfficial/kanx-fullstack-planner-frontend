import type { TechStackItem } from "@/lib/types/tech-stack";
import type { LLMPromptLanguage } from "@/lib/types/project";

export type ProjectConfig = {
  id: string;
  project_id: string;
  name: string;
  project_name: string;
  description: string | null;
  project_description: string | null;
  target_frontend_stack: string;
  target_backend_stack: string;
  target_frontend_stack_items: TechStackItem[];
  target_backend_stack_items: TechStackItem[];
  frontend_tech_stack: string;
  backend_tech_stack: string;
  target_stacks_configured: boolean;
  global_constraints: string[];
  coding_preferences: string[];
  code_preferences: string[];
  prompt_preferences: string[];
  llm_prompt_language: LLMPromptLanguage;
  status: string;
  created_at?: string;
  updated_at?: string;
};

export type ProjectConfigUpdateInput = {
  project_name?: string | null;
  project_description?: string | null;
  frontend_tech_stack?: string;
  backend_tech_stack?: string;
  target_frontend_stack_items?: TechStackItem[];
  target_backend_stack_items?: TechStackItem[];
  global_constraints?: string[];
  coding_preferences?: string[];
  prompt_preferences?: string[];
  name?: string | null;
  description?: string | null;
  target_frontend_stack?: string;
  target_backend_stack?: string;
  code_preferences?: string[];
  llm_prompt_language?: LLMPromptLanguage | null;
};
