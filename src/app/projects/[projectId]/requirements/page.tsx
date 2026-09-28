"use client";

import { useParams } from "next/navigation";
import { History } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { RequirementEditor } from "@/components/requirement/RequirementEditor";
import { RequirementList } from "@/components/requirement/RequirementList";
import { useLanguage } from "@/components/language/language-provider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ApiError } from "@/lib/api/client";
import { generateBusinessStories } from "@/lib/api/business-stories";
import {
  createProjectRequirement,
  getProjectRequirements,
  getRequirementBusinessStoryGeneration,
} from "@/lib/api/requirements";
import { isAbortError, useInFlightRef, useMountedRef } from "@/lib/async-control";
import { getRequirementProgressStatus } from "@/lib/requirement-progress";
import type { I18nDictionary } from "@/lib/i18n";
import type { BusinessStoryGenerationProgress, Requirement } from "@/lib/types/requirement";

const GENERATION_POLL_INTERVAL_MS = 2500;
const PROJECT_REFRESH_INTERVAL_MS = 3000;

function FieldMetaSectionTitle({ title }: { title: string }) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <History className="size-5 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
    </div>
  );
}

function debugBusinessStoryGeneration(
  requirementId: string,
  event: string,
  details?: Record<string, unknown>
) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.debug("[business-story-generation]", {
    requirement_id: requirementId,
    event,
    ...details,
  });
}

function getBusinessStoryGenerationErrorMessage(err: unknown, fallback: string, t: I18nDictionary) {
  if (err instanceof ApiError) {
    if (err.status === 400) {
      return t.forms.requirement.needRequirementForUpdate;
    }

    if (err.status === 503) {
      return t.businessStories.apiErrors.llmNotConfigured;
    }

    return err.message;
  }

  return err instanceof Error ? err.message : fallback;
}

function initialGenerationProgress(t: I18nDictionary): BusinessStoryGenerationProgress {
  return {
    run_id: null,
    status: "running",
    progress: 0,
    message: t.forms.requirement.updating,
    error_message: null,
    updated_at: new Date().toISOString(),
  };
}

function failedGenerationProgress(message: string, t: I18nDictionary): BusinessStoryGenerationProgress {
  return {
    run_id: null,
    status: "failed",
    progress: 0,
    message: t.forms.requirement.generationFailed,
    error_message: message,
    updated_at: new Date().toISOString(),
  };
}

function abnormalGenerationProgress(message: string, t: I18nDictionary): BusinessStoryGenerationProgress {
  return {
    run_id: null,
    status: "failed",
    progress: 0,
    message: t.forms.requirement.generationStatusAbnormal,
    error_message: message,
    updated_at: new Date().toISOString(),
  };
}

export default function ProjectRequirementsPage() {
  const { t } = useLanguage();
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requirementToRetry, setRequirementToRetry] = useState<Requirement | null>(null);
  const activeGenerationIdsRef = useRef<Set<string>>(new Set());
  const mountedRef = useMountedRef();
  const refreshInFlightRef = useInFlightRef();
  const pollInFlightRef = useInFlightRef();
  const abortControllersRef = useRef<Set<AbortController>>(new Set());

  const createTrackedController = useCallback(() => {
    const controller = new AbortController();
    abortControllersRef.current.add(controller);
    return controller;
  }, []);

  const releaseTrackedController = useCallback((controller: AbortController) => {
    abortControllersRef.current.delete(controller);
  }, []);

  const loadRequirements = useCallback(async (options?: { silent?: boolean; signal?: AbortSignal }) => {
    if (options?.silent && refreshInFlightRef.current) {
      return;
    }
    if (options?.silent) {
      refreshInFlightRef.current = true;
    }
    if (!options?.silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const loadedRequirements = await getProjectRequirements(projectId, {
        signal: options?.signal,
      });

      if (mountedRef.current && !options?.signal?.aborted) {
        setRequirements(loadedRequirements);
        setError(null);
      }
    } catch (err) {
      if (isAbortError(err)) {
        return;
      }
      if (!options?.silent && mountedRef.current) {
        setError(err instanceof Error ? err.message : t.forms.requirement.loadFailed);
      }
    } finally {
      if (options?.silent) {
        refreshInFlightRef.current = false;
      }
      if (!options?.silent && mountedRef.current) {
        setLoading(false);
      }
    }
  }, [mountedRef, projectId, refreshInFlightRef, t.forms.requirement.loadFailed]);

  const updateRequirementGeneration = useCallback(
    (requirementId: string, generation: BusinessStoryGenerationProgress | null) => {
      setRequirements((current) =>
        current.map((requirement) =>
          requirement.id === requirementId
            ? { ...requirement, business_story_generation: generation }
          : requirement
        )
      );
    },
    []
  );

  const runningRequirementIds = useMemo(
    () =>
      requirements
        .filter((requirement) => getRequirementProgressStatus(requirement) === "in_progress")
        .map((requirement) => requirement.id),
    [requirements]
  );
  const runningRequirementIdsKey = runningRequirementIds.join(",");
  const hasRunningRequirement = runningRequirementIds.length > 0;

  const runBusinessStoryGeneration = useCallback(
    async (requirementId: string) => {
      if (activeGenerationIdsRef.current.has(requirementId)) {
        return;
      }

      const controller = createTrackedController();
      activeGenerationIdsRef.current.add(requirementId);
      updateRequirementGeneration(requirementId, initialGenerationProgress(t));

      try {
        await generateBusinessStories(projectId, {
          requirement_id: requirementId,
          overwrite: false,
        }, { signal: controller.signal });
        debugBusinessStoryGeneration(requirementId, "generate_complete");
        await loadRequirements({ silent: true, signal: controller.signal });
      } catch (err) {
        if (isAbortError(err)) {
          return;
        }
        debugBusinessStoryGeneration(requirementId, "generate_error", {
          error: err instanceof Error ? err.message : String(err),
        });
        if (mountedRef.current) {
          updateRequirementGeneration(
            requirementId,
            failedGenerationProgress(
              getBusinessStoryGenerationErrorMessage(err, t.forms.requirement.updateStoriesFailed, t),
              t
            )
          );
        }
      } finally {
        activeGenerationIdsRef.current.delete(requirementId);
        releaseTrackedController(controller);
      }
    },
    [
      createTrackedController,
      loadRequirements,
      mountedRef,
      projectId,
      releaseTrackedController,
      t,
      updateRequirementGeneration,
    ]
  );

  const handleRetryBusinessStoryGeneration = useCallback(
    (requirementId: string) => {
      const requirement = requirements.find((item) => item.id === requirementId);

      if (requirement && getRequirementProgressStatus(requirement) !== "in_progress") {
        setRequirementToRetry(requirement);
      }
    },
    [requirements]
  );

  const handleConfirmRetryBusinessStoryGeneration = () => {
    if (!requirementToRetry) {
      return;
    }

    if (getRequirementProgressStatus(requirementToRetry) === "in_progress") {
      setRequirementToRetry(null);
      return;
    }

    void runBusinessStoryGeneration(requirementToRetry.id);
    setRequirementToRetry(null);
  };

  const pollRunningRequirementGenerations = useCallback(
    async (requirementIds: string[], signal?: AbortSignal) => {
      if (pollInFlightRef.current) {
        return;
      }
      pollInFlightRef.current = true;
      try {
        const generations = await Promise.all(
          requirementIds.map(async (requirementId) => {
            const generation = await getRequirementBusinessStoryGeneration(requirementId, { signal });

            debugBusinessStoryGeneration(requirementId, "status_poll", {
              status: generation?.status ?? null,
              progress: generation?.progress ?? null,
              error: generation?.error_message ?? null,
            });

            if (!generation) {
              if (mountedRef.current && !signal?.aborted) {
                updateRequirementGeneration(
                  requirementId,
                  abnormalGenerationProgress(t.forms.requirement.generationAbnormalHint, t)
                );
              }
              return null;
            }

            if (generation.status === "idle") {
              if (mountedRef.current && !signal?.aborted) {
                updateRequirementGeneration(
                  requirementId,
                  abnormalGenerationProgress(t.forms.requirement.generationAbnormalHint, t)
                );
              }
              return generation;
            }

            if (mountedRef.current && !signal?.aborted) {
              updateRequirementGeneration(requirementId, generation);
            }
            return generation;
          })
        );

        if (generations.some((generation) => generation?.status === "succeeded")) {
          await loadRequirements({ silent: true, signal });
        }
      } catch (err) {
        if (!isAbortError(err)) {
          throw err;
        }
      } finally {
        pollInFlightRef.current = false;
      }
    },
    [loadRequirements, mountedRef, pollInFlightRef, t, updateRequirementGeneration]
  );

  const handleSaveRequirement = async (rawText: string) => {
    const requirement = await createProjectRequirement(projectId, {
      raw_text: rawText,
      language: "zh-CN",
      source_type: "manual",
    });

    const generation = initialGenerationProgress(t);
    const requirementWithGeneration: Requirement = {
      ...requirement,
      business_story_generation: generation,
    };

    setRequirements((current) => [requirementWithGeneration, ...current]);
    void runBusinessStoryGeneration(requirement.id);

    return requirement;
  };

  useEffect(() => {
    const controller = createTrackedController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRequirements({ signal: controller.signal });

    return () => {
      controller.abort();
      releaseTrackedController(controller);
    };
  }, [createTrackedController, loadRequirements, releaseTrackedController]);

  useEffect(() => {
    const controller = createTrackedController();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadRequirements({ silent: true, signal: controller.signal });
      }
    }, PROJECT_REFRESH_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadRequirements({ silent: true, signal: controller.signal });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      controller.abort();
      releaseTrackedController(controller);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [createTrackedController, loadRequirements, releaseTrackedController]);

  useEffect(() => {
    if (!runningRequirementIdsKey) {
      return;
    }

    const requirementIds = runningRequirementIdsKey.split(",");
    const controller = createTrackedController();

    const interval = window.setInterval(() => {
      void pollRunningRequirementGenerations(requirementIds, controller.signal).catch((err: unknown) => {
        console.error("Failed to poll business story generation status", err);
      });
    }, GENERATION_POLL_INTERVAL_MS);

    return () => {
      controller.abort();
      releaseTrackedController(controller);
      window.clearInterval(interval);
    };
  }, [createTrackedController, pollRunningRequirementGenerations, releaseTrackedController, runningRequirementIdsKey]);

  useEffect(() => {
    const abortControllers = abortControllersRef.current;

    return () => {
      abortControllers.forEach((controller) => controller.abort());
      abortControllers.clear();
    };
  }, []);

  return (
    <div className="space-y-6 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <Card className="lg:flex lg:min-h-[26rem] lg:flex-1 lg:flex-col">
        <CardHeader>
          <FieldMetaSectionTitle title={t.forms.requirement.historyTitle} />
        </CardHeader>
        <CardContent className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-4">
          {loading ? <LoadingState label={t.forms.requirement.loadingRequirements} /> : null}
          {!loading && error ? <ErrorState message={error} actionLabel={t.common.reload} onAction={loadRequirements} /> : null}
          {!loading && !error ? (
            <RequirementList
              requirements={requirements}
              onRetryBusinessStoryGeneration={handleRetryBusinessStoryGeneration}
            />
          ) : null}
        </CardContent>
      </Card>

      <div className="lg:shrink-0">
        <RequirementEditor
          compact
          hideLabel
          submitButton="icon"
          disabled={hasRunningRequirement}
          onSave={handleSaveRequirement}
        />
      </div>

      <ConfirmDialog
        open={Boolean(requirementToRetry)}
        title={t.forms.requirement.retryConfirmTitle}
        description={t.forms.requirement.retryConfirmDescription}
        confirmText={t.forms.requirement.confirmRetry}
        cancelText={t.businessStories.cancel}
        onConfirm={handleConfirmRetryBusinessStoryGeneration}
        onOpenChange={(open) => {
          if (!open) {
            setRequirementToRetry(null);
          }
        }}
      />
    </div>
  );
}
