import { apiRequest } from "@/lib/api/client";
import type { ChangeSet } from "@/lib/types/change-set";
import type { GenerationRun } from "@/lib/types/generation-run";

type ApiRequestOptions = {
  signal?: AbortSignal;
};

export function listChangeSets(projectId: string, options?: ApiRequestOptions) {
  return apiRequest<ChangeSet[]>(`/projects/${projectId}/change-sets`, {
    signal: options?.signal,
  });
}

export function listActiveChangeSetApplicationRuns(projectId: string, options?: ApiRequestOptions) {
  return apiRequest<GenerationRun[]>(`/projects/${projectId}/change-set-application-runs`, {
    signal: options?.signal,
  });
}

export function getChangeSet(changeSetId: string) {
  return apiRequest<ChangeSet>(`/change-sets/${changeSetId}`);
}

export function applyChangeSet(changeSetId: string, options?: ApiRequestOptions) {
  return apiRequest<GenerationRun>(`/change-sets/${changeSetId}/apply`, {
    method: "POST",
    signal: options?.signal,
  });
}

export function applyChangeSetBatch(projectId: string, batchId: string, options?: ApiRequestOptions) {
  return apiRequest<GenerationRun>(`/projects/${projectId}/change-set-batches/${batchId}/apply`, {
    method: "POST",
    signal: options?.signal,
  });
}

export function discardChangeSet(changeSetId: string) {
  return apiRequest<ChangeSet>(`/change-sets/${changeSetId}/discard`, {
    method: "POST",
  });
}

export function regenerateChangeSet(changeSetId: string) {
  return apiRequest<GenerationRun>(`/change-sets/${changeSetId}/regenerate`, {
    method: "POST",
  });
}
