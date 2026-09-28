import { apiRequest } from "@/lib/api/client";
import type { BackendImplementation } from "@/lib/types/backend-implementation";
import type { BackendServiceDesign } from "@/lib/types/backend-service-design";

export function listBackendImplementationVersions(projectId: string, options?: { signal?: AbortSignal }) {
  return apiRequest<BackendImplementation[]>(`/projects/${projectId}/backend-implementations`, {
    signal: options?.signal,
  });
}

export function listBackendServiceDesigns(projectId: string, options?: { signal?: AbortSignal }) {
  return listBackendImplementationVersions(projectId, options);
}

export function listBackendImplementations(projectId: string, options?: { signal?: AbortSignal }) {
  return listBackendImplementationVersions(projectId, options);
}

export function getBackendImplementationVersion(id: string) {
  return apiRequest<BackendImplementation>(`/backend-implementations/${id}`);
}

export function getBackendServiceDesign(id: string) {
  return getBackendImplementationVersion(id);
}

export function getBackendImplementation(id: string) {
  return getBackendImplementationVersion(id);
}

export function updateBackendServiceDesign(id: string, input: Partial<BackendServiceDesign>) {
  return apiRequest<BackendServiceDesign>(`/backend-service-designs/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function updateBackendImplementationVersion(id: string, input: Partial<BackendImplementation>) {
  return apiRequest<BackendImplementation>(`/backend-implementations/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function updateBackendImplementation(id: string, input: Partial<BackendImplementation>) {
  return updateBackendImplementationVersion(id, input);
}
