import { apiRequest } from "@/lib/api/client";
import type { ProjectBlueprint } from "@/lib/types/blueprint";

export function generateProjectBlueprint(projectId: string) {
  return apiRequest<ProjectBlueprint>(`/projects/${projectId}/generate/blueprint`, {
    method: "POST",
  });
}

export function getProjectBlueprints(projectId: string) {
  return apiRequest<ProjectBlueprint[]>(`/projects/${projectId}/blueprints`);
}

export function getBlueprint(blueprintId: string) {
  return apiRequest<ProjectBlueprint>(`/blueprints/${blueprintId}`);
}

export function summarizeProjectBlueprint(projectId: string) {
  return apiRequest<ProjectBlueprint>(`/projects/${projectId}/blueprint/summarize`, {
    method: "POST",
  });
}

export function updateBlueprint(blueprintId: string, input: Partial<ProjectBlueprint>) {
  return apiRequest<ProjectBlueprint>(`/blueprints/${blueprintId}`, {
    method: "PATCH",
    body: input,
  });
}
