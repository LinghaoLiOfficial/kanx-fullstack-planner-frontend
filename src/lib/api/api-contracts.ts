import { apiRequest } from "@/lib/api/client";
import type { ApiContractDraft } from "@/lib/types/api-contract";

export function generateApiContract(projectId: string) {
  return apiRequest<ApiContractDraft>(`/projects/${projectId}/generate/api-contract`, {
    method: "POST",
  });
}

export function listApiContracts(projectId: string, options?: { signal?: AbortSignal }) {
  return apiRequest<ApiContractDraft[]>(`/projects/${projectId}/api-contracts`, {
    signal: options?.signal,
  });
}

export function getApiContract(apiContractId: string) {
  return apiRequest<ApiContractDraft>(`/api-contracts/${apiContractId}`);
}

export function updateApiContract(apiContractId: string, input: Partial<ApiContractDraft>) {
  return apiRequest<ApiContractDraft>(`/api-contracts/${apiContractId}`, {
    method: "PATCH",
    body: input,
  });
}
