import { apiRequest } from "@/lib/api/client";
import type { HealthResponse } from "@/lib/types/health";

export function getHealth() {
  return apiRequest<HealthResponse>("/health");
}
