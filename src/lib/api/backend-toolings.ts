import { apiRequest } from "@/lib/api/client";
import type { BackendTooling } from "@/lib/types/backend-tooling";

export function listBackendToolings(projectId: string) {
  return apiRequest<BackendTooling[]>(`/projects/${projectId}/backend-toolings`);
}

export function getBackendTooling(id: string) {
  return apiRequest<BackendTooling>(`/backend-toolings/${id}`);
}

export function updateBackendTooling(id: string, input: Partial<BackendTooling>) {
  return apiRequest<BackendTooling>(`/backend-toolings/${id}`, {
    method: "PATCH",
    body: input,
  });
}
