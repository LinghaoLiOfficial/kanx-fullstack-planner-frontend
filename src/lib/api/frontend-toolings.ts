import { apiRequest } from "@/lib/api/client";
import type { FrontendTooling } from "@/lib/types/frontend-tooling";

export function listFrontendToolings(projectId: string) {
  return apiRequest<FrontendTooling[]>(`/projects/${projectId}/frontend-toolings`);
}

export function getFrontendTooling(id: string) {
  return apiRequest<FrontendTooling>(`/frontend-toolings/${id}`);
}

export function updateFrontendTooling(id: string, input: Partial<FrontendTooling>) {
  return apiRequest<FrontendTooling>(`/frontend-toolings/${id}`, {
    method: "PATCH",
    body: input,
  });
}
