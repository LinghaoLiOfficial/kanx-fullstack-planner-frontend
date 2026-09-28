import type { Requirement, RequirementProgressStatus } from "@/lib/types/requirement";

const PROGRESS_STATUS_LABELS: Record<RequirementProgressStatus, string> = {
  in_progress: "进行中",
  success: "成功",
  failed: "失败",
};

export function getRequirementProgressStatus(requirement: Requirement): RequirementProgressStatus {
  const generationStatus = requirement.business_story_generation?.status;

  if (generationStatus === "running") {
    return "in_progress";
  }

  if (generationStatus === "succeeded") {
    return "success";
  }

  if (generationStatus === "failed") {
    return "failed";
  }

  if (requirement.progress_status) {
    return requirement.progress_status;
  }

  return "failed";
}

export function getRequirementProgressStatusLabel(status: RequirementProgressStatus) {
  return PROGRESS_STATUS_LABELS[status];
}

export function stripTrailingProgressPunctuation(text: string) {
  return text.trim().replace(/[。.…]+$/g, "");
}
