import { apiRequest } from "@/lib/api/client";
import type { ProjectConfig, ProjectConfigUpdateInput } from "@/lib/types/project-config";

export function getProjectConfig(projectId: string) {
  return apiRequest<ProjectConfig>(`/projects/${projectId}/configuration`);
}

export function updateProjectConfig(projectId: string, input: Partial<ProjectConfigUpdateInput>) {
  return apiRequest<ProjectConfig>(`/projects/${projectId}/configuration`, {
    method: "PATCH",
    body: input,
  });
}
