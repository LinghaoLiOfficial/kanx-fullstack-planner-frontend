import type { ImplementationScope } from "@/lib/types/business-story";
import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export type PromptBlock = {
  needed: boolean;
  title?: string;
  body?: string;
  prompt?: string;
  affected_files?: unknown[];
  do_not_modify?: unknown[];
  verification_steps?: unknown[];
};

export type PromptPackContent = {
  batch_summary?: string;
  implementation_scope?: ImplementationScope;
  diff_summary?: string | {
    added?: unknown;
    modified?: unknown;
    removed?: unknown;
    [key: string]: unknown;
  };
  execution_order?: unknown[];
  frontend_prompt?: PromptBlock;
  backend_prompt?: PromptBlock;
  acceptance_checklist?: unknown[];
  rollback_notes?: unknown[];
  [key: string]: unknown;
};

export type PromptPack = VersionedDesignAsset<PromptPackContent> & {
  role?: string;
  prompt_text?: string;
  format?: string;
};
