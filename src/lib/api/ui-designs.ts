import { apiRequest } from "@/lib/api/client";
import type { UIDesign } from "@/lib/types/ui-design";

type UpdateDesignAssetInput = {
  title?: string;
  summary?: string | null;
  content?: unknown;
};

export function listUIDesigns(projectId: string, options?: { signal?: AbortSignal }) {
  return apiRequest<UIDesign[]>(`/projects/${projectId}/ui-designs`, {
    signal: options?.signal,
  });
}

export function getUIDesign(uiDesignId: string) {
  return apiRequest<UIDesign>(`/ui-designs/${uiDesignId}`);
}

export function updateUIDesign(uiDesignId: string, input: UpdateDesignAssetInput) {
  return apiRequest<UIDesign>(`/ui-designs/${uiDesignId}`, {
    method: "PATCH",
    body: input,
  });
}
