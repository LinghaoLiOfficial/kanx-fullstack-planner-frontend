export type BusinessStoryGenerationStatus =
  | "idle"
  | "running"
  | "succeeded"
  | "failed";

export type BusinessStoryGenerationProgress = {
  run_id: string | null;
  status: BusinessStoryGenerationStatus;
  progress: number;
  message: string | null;
  error_message?: string | null;
  updated_at: string | null;
};

export type RequirementProgressStatus =
  | "in_progress"
  | "success"
  | "failed";

export type Requirement = {
  id: string;
  project_id: string;
  raw_text: string;
  language: string;
  source_type: string;
  progress_status?: RequirementProgressStatus;
  progress_label?: string;
  progress_text?: string;
  created_at: string;
  updated_at: string;
  business_story_generation?: BusinessStoryGenerationProgress | null;
};

export type CreateRequirementPayload = {
  raw_text: string;
  language?: string;
  source_type?: string;
};

export type RequirementFieldMetadata = {
  chineseName: string;
  englishName: string;
  meaning: string;
};

export type RawUserRequirements = Requirement[];
export type NewUserRequirement = CreateRequirementPayload;
export type RequirementHistory = Requirement[];
export type RequirementItem = Requirement;
