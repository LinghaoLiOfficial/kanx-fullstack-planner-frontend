import { apiRequest } from "@/lib/api/client";
import type { ConsistencyCheck } from "@/lib/types/consistency";

export function getConsistencyCheck(projectId: string) {
  return apiRequest<ConsistencyCheck>(`/projects/${projectId}/consistency-check`);
}
