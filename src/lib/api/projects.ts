import { apiRequest } from "@/lib/api/client";
import type {
  CreateProjectPayload,
  Project,
  ProjectDescriptionOptionsPayload,
  ProjectDescriptionOptionsResponse,
  UpdateProjectPayload,
} from "@/lib/types/project";

export function listProjects(q?: string) {
  const keyword = q?.trim();

  return apiRequest<Project[]>("/projects", {
    query: keyword ? { q: keyword } : undefined,
  });
}

export function getProjects() {
  return listProjects();
}

export function createProject(payload: CreateProjectPayload) {
  return apiRequest<Project>("/projects", {
    method: "POST",
    body: payload,
  });
}

export function generateProjectDescriptionOptions(payload: ProjectDescriptionOptionsPayload) {
  return apiRequest<ProjectDescriptionOptionsResponse>("/projects/description-options", {
    method: "POST",
    body: payload,
  });
}

export function getProject(projectId: string) {
  return apiRequest<Project>(`/projects/${projectId}`);
}

export function recordProjectOpened(projectId: string) {
  return apiRequest<Project>(`/projects/${projectId}/opened`, {
    method: "POST",
  });
}

export function updateProject(projectId: string, payload: UpdateProjectPayload) {
  return apiRequest<Project>(`/projects/${projectId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteProject(projectId: string) {
  return apiRequest<void>(`/projects/${projectId}`, {
    method: "DELETE",
  });
}
