import { apiRequest } from "@/lib/api/client";
import type { ContextPack, ContextPackExport } from "@/lib/types/context-pack";

export function generateContextPacks(projectId: string) {
  return apiRequest<ContextPack[]>(`/projects/${projectId}/generate/context-packs`, {
    method: "POST",
  });
}

export function listContextPacks(projectId: string, role?: string) {
  return apiRequest<ContextPack[]>(`/projects/${projectId}/context-packs`, {
    query: { role },
  });
}

export function getContextPack(contextPackId: string) {
  return apiRequest<ContextPack>(`/context-packs/${contextPackId}`);
}

export function exportContextPack(contextPackId: string) {
  return apiRequest<ContextPackExport>(`/context-packs/${contextPackId}/export`, {
    method: "POST",
  });
}
