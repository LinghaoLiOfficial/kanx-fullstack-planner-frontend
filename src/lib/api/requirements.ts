import { apiRequest } from "@/lib/api/client";
import type {
  BusinessStoryGenerationProgress,
  CreateRequirementPayload,
  Requirement,
} from "@/lib/types/requirement";

type ApiRequestOptions = {
  signal?: AbortSignal;
};

export function getProjectRequirements(projectId: string, options?: ApiRequestOptions) {
  return apiRequest<Requirement[]>(`/projects/${projectId}/requirements`, {
    signal: options?.signal,
  });
}

export function createProjectRequirement(projectId: string, payload: CreateRequirementPayload) {
  return apiRequest<Requirement>(`/projects/${projectId}/requirements`, {
    method: "POST",
    body: payload,
  });
}

export function getRequirementBusinessStoryGeneration(requirementId: string, options?: ApiRequestOptions) {
  return apiRequest<BusinessStoryGenerationProgress | null>(
    `/requirements/${requirementId}/business-story-generation`,
    {
      signal: options?.signal,
    }
  );
}
