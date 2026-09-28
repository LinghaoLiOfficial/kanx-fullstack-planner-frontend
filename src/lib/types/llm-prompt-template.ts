import type { LLMPromptLanguage } from "@/lib/types/project";

export type LLMPromptTemplateVersion = {
  language: LLMPromptLanguage;
  system_prompt: string;
  user_prompt_template: string;
};

export type LLMPromptTemplateTask = {
  task_key: string;
  task_label: string;
  run_type: string;
  template_name: string;
  system_prompt: string;
  user_prompt_template: string;
  schema_name: string;
  versions: LLMPromptTemplateVersion[];
};

export type LLMPromptTemplateModule = {
  module_key: string;
  module_label: string;
  tasks: LLMPromptTemplateTask[];
};
