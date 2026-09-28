"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { History, List, ListChecks, PanelTopOpen, X } from "lucide-react";

import { BusinessStoryCard } from "@/components/business-stories/BusinessStoryCard";
import { BusinessStoryList } from "@/components/business-stories/BusinessStoryList";
import { BusinessStoryPriorityBadge } from "@/components/business-stories/BusinessStoryPriorityBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/language/language-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import {
  deleteBusinessStory,
  executeBusinessStory,
  listBusinessStories,
  updateBusinessStory,
} from "@/lib/api/business-stories";
import { getGenerationRun } from "@/lib/api/generation-runs";
import { isAbortError, useInFlightRef, useMountedRef } from "@/lib/async-control";
import {
  businessStoryImpactScopeOptions,
  getBusinessStoryImpactScopeLabel,
  implementationScopeLabels,
} from "@/lib/design-asset-labels";
import type { I18nDictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type {
  BusinessRequirementStory,
  BusinessStoryPriority,
  AffectedLayer,
  UpdateBusinessStoryInput,
} from "@/lib/types/business-story";
import type { GenerationRun } from "@/lib/types/generation-run";

function getBusinessStoryErrorMessage(err: unknown, fallback: string, t: I18nDictionary) {
  if (err instanceof ApiError) {
    if (err.status === 400) {
      return t.businessStories.apiErrors.needRequirement;
    }

    if (err.status === 503) {
      return t.businessStories.apiErrors.llmNotConfigured;
    }

    return err.message;
  }

  return err instanceof Error ? err.message : fallback;
}

const successfulExecutionStatuses = new Set([
  "applied",
  "implemented",
  "verified",
  "done",
]);
const generationRunPollIntervalMs = 2000;
const generationRunMaxPolls = 180;
const projectRefreshIntervalMs = 3000;
const completedGenerationRunStatuses = new Set(["completed", "succeeded", "success"]);
const failedGenerationRunStatuses = new Set(["failed", "error", "cancelled"]);

function sleep(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function formatHistoryDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildStoryVersionMap(stories: BusinessRequirementStory[]) {
  const orderedStories = [...stories].sort(
    (a, b) =>
      Date.parse(a.created_at) - Date.parse(b.created_at) ||
      Date.parse(a.updated_at) - Date.parse(b.updated_at)
  );

  return new Map(orderedStories.map((story, index) => [story.id, index + 1]));
}

function sortHistoryStories(stories: BusinessRequirementStory[]) {
  return [...stories].sort(
    (a, b) =>
      Date.parse(b.applied_at ?? b.updated_at) - Date.parse(a.applied_at ?? a.updated_at) ||
      Date.parse(b.created_at) - Date.parse(a.created_at)
  );
}

function isSuccessfullyExecutedStory(story: BusinessRequirementStory, run?: GenerationRun) {
  return successfulExecutionStatuses.has(story.status) || Boolean(run && completedGenerationRunStatuses.has(run.status));
}

function matchesImpactScopeFilter(
  story: BusinessRequirementStory,
  scopeFilter:
    | "frontend_only"
    | "backend_only"
    | "fullstack"
    | "non_code"
    | "ux_design"
    | "ui_design"
    | "frontend_implementation"
    | "api_contract"
    | "backend_implementation"
    | "database_models"
    | ""
) {
  if (!scopeFilter) {
    return true;
  }

  if (scopeFilter in implementationScopeLabels) {
    return story.implementation_scope === scopeFilter;
  }

  if (scopeFilter === "frontend_implementation") {
    return story.affected_layers.some((layer) =>
      ["frontend_implementation", "frontend_pages", "frontend_tools"].includes(layer)
    );
  }

  if (scopeFilter === "backend_implementation") {
    return story.affected_layers.some((layer) =>
      ["backend_implementation", "backend_services", "backend_tools"].includes(layer)
    );
  }

  if (scopeFilter === "database_models") {
    return story.affected_layers.some((layer) =>
      ["database_models", "database_model", "db_model"].includes(layer)
    );
  }

  return story.affected_layers.includes(scopeFilter as AffectedLayer);
}

function StoryIndexPanel({
  stories,
  activeStoryId,
  onStorySelect,
}: {
  stories: BusinessRequirementStory[];
  activeStoryId: string | null;
  onStorySelect: (storyId: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <Card className="lg:sticky lg:top-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="size-5 text-muted-foreground" aria-hidden="true" />
          {t.businessStories.storyList}
        </CardTitle>
      </CardHeader>
      <CardContent className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-4">
        <div className="space-y-1.5">
          {stories.length > 0 ? (
            stories.map((story) => {
              const isActive = story.id === activeStoryId;

              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => onStorySelect(story.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border/60 hover:border-primary/50 hover:bg-muted/60"
                  }`}
                >
                  <span className="min-w-0 whitespace-normal break-words font-medium leading-5">
                    {story.requirement_name ?? story.title}
                  </span>
                  <span className="shrink-0">
                    <BusinessStoryPriorityBadge priority={story.priority} />
                  </span>
                  {isActive ? <span className="sr-only">{t.businessStories.currentStory}</span> : null}
                </button>
              );
            })
          ) : (
            <p className="text-xs text-muted-foreground">{t.businessStories.noIndexedStories}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ExecutionHistoryCard({
  stories,
  loading,
  error,
  selectedStoryId,
  storyVersionById,
  onSelectStory,
  onClose,
  onRetry,
}: {
  stories: BusinessRequirementStory[];
  loading: boolean;
  error: string | null;
  selectedStoryId: string | null;
  storyVersionById: Map<string, number>;
  onSelectStory: (storyId: string) => void;
  onClose: () => void;
  onRetry: () => void;
}) {
  const { locale, t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [dragPointerId, setDragPointerId] = useState<number | null>(null);
  const [floatingPosition, setFloatingPosition] = useState<{ left: number; top: number } | null>(null);
  const selectedStory = stories.find((story) => story.id === selectedStoryId) ?? stories[0] ?? null;

  const constrainFloatingPosition = (left: number, top: number) => {
    const rect = cardRef.current?.getBoundingClientRect();
    const margin = 8;
    const maxLeft = Math.max(margin, window.innerWidth - (rect?.width ?? 0) - margin);
    const maxTop = Math.max(margin, window.innerHeight - (rect?.height ?? 0) - margin);

    return {
      left: Math.min(Math.max(left, margin), maxLeft),
      top: Math.min(Math.max(top, margin), maxTop),
    };
  };

  const handleDragStart = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button")) {
      return;
    }

    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setFloatingPosition({ left: rect.left, top: rect.top });
    setDragPointerId(event.pointerId);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleDragMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragPointerId !== event.pointerId) {
      return;
    }

    setFloatingPosition(
      constrainFloatingPosition(
        event.clientX - dragOffsetRef.current.x,
        event.clientY - dragOffsetRef.current.y
      )
    );
  };

  const handleDragEnd = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragPointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragPointerId(null);
  };

  return (
    <Card
      ref={cardRef}
      className={cn(
        "fixed z-40 flex h-[min(38rem,calc(100vh-6rem))] max-h-[calc(100vh-6rem)] w-[min(64rem,calc(100vw-2rem))] flex-col shadow-xl lg:h-[min(42rem,calc(100vh-8rem))] lg:max-h-[calc(100vh-8rem)] lg:w-[min(72rem,calc(100vw-4rem))]",
        floatingPosition ? "" : "left-1/2 top-20 -translate-x-1/2 lg:top-24"
      )}
      style={
        floatingPosition
          ? {
              left: floatingPosition.left,
              top: floatingPosition.top,
            }
          : undefined
      }
    >
      <CardHeader
        className={cn(
          "flex-row items-start justify-between gap-4 border-b border-border/60 select-none",
          dragPointerId === null ? "cursor-grab" : "cursor-grabbing"
        )}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
      >
        <div className="flex min-w-0 items-center gap-2">
          <History className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <CardTitle>{t.businessStories.history}</CardTitle>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          aria-label={t.businessStories.closeHistory}
          title={t.businessStories.closeHistory}
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-y-auto p-4 lg:overflow-hidden">
        {loading ? (
          <div className="flex h-full min-h-48 items-center justify-center text-sm text-muted-foreground">
            {t.businessStories.loadingHistory}
          </div>
        ) : null}
        {!loading && error ? <ErrorState message={error} actionLabel={t.common.reload} onAction={onRetry} /> : null}
        {!loading && !error && stories.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t.businessStories.noHistory}</p>
        ) : null}
        {!loading && !error && stories.length > 0 ? (
          <div className="grid gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-stretch">
            <section className="min-h-0 space-y-3 lg:overflow-hidden">
              <div className="flex items-center gap-2">
                <List className="size-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-base font-semibold">{t.businessStories.recordList}</h3>
              </div>
              <div className="space-y-2 lg:h-[calc(100%-2.5rem)] lg:overflow-y-auto lg:pr-2">
                {stories.map((story) => {
                  const active = selectedStory?.id === story.id;

                  return (
                    <button
                      key={story.id}
                      type="button"
                      onClick={() => onSelectStory(story.id)}
                      className={cn(
                        "w-full rounded-lg border border-border/70 bg-muted/20 p-3 text-left transition-colors hover:bg-muted",
                        active && "border-foreground bg-muted"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-md border border-border px-2 py-0.5 text-xs font-medium">
                          v{storyVersionById.get(story.id) ?? 1}
                        </span>
                      </div>
                      <div className="mt-3 text-xs leading-5 text-muted-foreground">
                        {formatHistoryDate(story.applied_at ?? story.updated_at, locale)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="min-h-0 space-y-3 lg:overflow-hidden">
              <div className="flex items-center gap-2">
                <PanelTopOpen className="size-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-base font-semibold">{t.businessStories.storyDetails}</h3>
              </div>
              <div className="space-y-4 lg:h-[calc(100%-2.5rem)] lg:overflow-y-auto lg:pr-2">
                {selectedStory ? (
                  <BusinessStoryCard
                    story={selectedStory}
                    readOnly
                    onUpdateStory={async () => selectedStory}
                    onPriorityChange={async () => undefined}
                  />
                ) : (
                  <p className="text-sm leading-6 text-muted-foreground">{t.businessStories.noStoryDetails}</p>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

const allFilterValue = "all";

export default function ProjectBusinessStoriesPage() {
  const { locale, t } = useLanguage();
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [stories, setStories] = useState<BusinessRequirementStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storyToDelete, setStoryToDelete] = useState<BusinessRequirementStory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<BusinessStoryPriority | "">("");
  const [scopeFilter, setScopeFilter] = useState<
    (typeof businessStoryImpactScopeOptions)[number] | ""
  >("");
  const [keyword, setKeyword] = useState("");
  const [executingStoryId, setExecutingStoryId] = useState<string | null>(null);
  const [executionProgressByStoryId, setExecutionProgressByStoryId] = useState<
    Record<string, GenerationRun | undefined>
  >({});
  const [executeError, setExecuteError] = useState<string | null>(null);
  const [storyTargetId, setStoryTargetId] = useState<string | null>(null);
  const [storyScrollRequestKey, setStoryScrollRequestKey] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyStories, setHistoryStories] = useState<BusinessRequirementStory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [selectedHistoryStoryId, setSelectedHistoryStoryId] = useState<string | null>(null);
  const mountedRef = useMountedRef();
  const refreshInFlightRef = useInFlightRef();
  const abortControllersRef = useRef<Set<AbortController>>(new Set());
  const showCurrentStoryList = true;

  const createTrackedController = useCallback(() => {
    const controller = new AbortController();
    abortControllersRef.current.add(controller);
    return controller;
  }, []);

  const releaseTrackedController = useCallback((controller: AbortController) => {
    abortControllersRef.current.delete(controller);
  }, []);

  const currentStories = useMemo(
    () =>
      stories.filter(
        (story) =>
          story.is_current !== false &&
          !isSuccessfullyExecutedStory(story, executionProgressByStoryId[story.id])
      ),
    [executionProgressByStoryId, stories]
  );
  const filteredCurrentStories = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return currentStories.filter((story) => {
      if (priorityFilter && story.priority !== priorityFilter) {
        return false;
      }

      if (!matchesImpactScopeFilter(story, scopeFilter)) {
        return false;
      }

      if (!q) {
        return true;
      }

      return [story.title, story.user_story, story.execution_notes ?? ""].join("\n").toLowerCase().includes(q);
    });
  }, [currentStories, keyword, priorityFilter, scopeFilter]);
  const hasExecutingStory = useMemo(
    () =>
      executingStoryId !== null ||
      Object.values(executionProgressByStoryId).some(
        (run) =>
          run &&
          !completedGenerationRunStatuses.has(run.status) &&
          !failedGenerationRunStatuses.has(run.status)
      ),
    [executionProgressByStoryId, executingStoryId]
  );
  const storyVersionById = useMemo(
    () => buildStoryVersionMap(historyStories),
    [historyStories]
  );

  const handleSelectStory = (storyId: string) => {
    setStoryTargetId(storyId);
    setStoryScrollRequestKey((current) => current + 1);
  };

  const pollExecutionRun = async (storyId: string, initialRun: GenerationRun, signal?: AbortSignal) => {
    let currentRun = initialRun;
    if (mountedRef.current && !signal?.aborted) {
      setExecutionProgressByStoryId((current) => ({
        ...current,
        [storyId]: currentRun,
      }));
    }

    if (
      !completedGenerationRunStatuses.has(currentRun.status) &&
      !failedGenerationRunStatuses.has(currentRun.status) &&
      mountedRef.current &&
      !signal?.aborted
    ) {
      setExecutingStoryId(storyId);
    }

    try {
      for (let attempt = 0; attempt < generationRunMaxPolls; attempt += 1) {
        if (signal?.aborted || !mountedRef.current) {
          return currentRun;
        }

        if (completedGenerationRunStatuses.has(currentRun.status)) {
          break;
        }

        if (failedGenerationRunStatuses.has(currentRun.status)) {
          throw new Error(currentRun.error_message || currentRun.message || t.businessStories.generationFailed);
        }

        await sleep(generationRunPollIntervalMs);
        currentRun = await getGenerationRun(initialRun.id, { signal });
        if (mountedRef.current && !signal?.aborted) {
          setExecutionProgressByStoryId((current) => ({
            ...current,
            [storyId]: currentRun,
          }));
        }
      }

      if (signal?.aborted || !mountedRef.current) {
        return currentRun;
      }

      if (!completedGenerationRunStatuses.has(currentRun.status)) {
        throw new Error(t.businessStories.generationTimeout);
      }

      return currentRun;
    } finally {
      if (mountedRef.current && !signal?.aborted) {
        setExecutingStoryId((current) => (current === storyId ? null : current));
      }
    }
  };

  const restoreExecutionProgress = async (nextStories: BusinessRequirementStory[], signal?: AbortSignal) => {
    const storiesWithExecutionRuns = nextStories.filter(
      (story) => story.execution_generation_run_id
    );

    if (storiesWithExecutionRuns.length === 0) {
      return;
    }

    const restoredRuns = await Promise.all(
      storiesWithExecutionRuns.map(async (story) => {
        try {
          return {
            storyId: story.id,
            run: await getGenerationRun(story.execution_generation_run_id as string, { signal }),
          };
        } catch {
          return null;
        }
      })
    );

    await Promise.all(
      restoredRuns
        .filter((item): item is { storyId: string; run: GenerationRun } => item !== null)
        .map(async ({ storyId, run }) => {
          try {
            await pollExecutionRun(storyId, run, signal);
          } catch (err) {
            if (!isAbortError(err) && mountedRef.current && !signal?.aborted) {
              setExecuteError(err instanceof Error ? err.message : t.businessStories.restoreExecutionFailed);
            }
          }
        })
    );
  };

  const loadStories = async (options?: { silent?: boolean; signal?: AbortSignal }) => {
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
      const nextStories = await listBusinessStories(projectId, undefined, {
        signal: options?.signal,
      });
      if (mountedRef.current && !options?.signal?.aborted) {
        setStories(nextStories);
        setError(null);
        void restoreExecutionProgress(nextStories, options?.signal);
      }
    } catch (err) {
      if (isAbortError(err)) {
        return;
      }
      if (!options?.silent && mountedRef.current) {
        setError(getBusinessStoryErrorMessage(err, t.businessStories.loadFailed, t));
      }
    } finally {
      if (options?.silent) {
        refreshInFlightRef.current = false;
      }
      if (!options?.silent && mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const replaceStory = (updatedStory: BusinessRequirementStory) => {
    setStories((current) => current.map((story) => (story.id === updatedStory.id ? updatedStory : story)));
  };

  const handlePriorityChange = async (storyId: string, priority: BusinessStoryPriority) => {
    replaceStory(await updateBusinessStory(storyId, { priority }));
  };

  const handleUpdateStory = async (storyId: string, input: UpdateBusinessStoryInput) => {
    const updatedStory = await updateBusinessStory(storyId, input);
    replaceStory(updatedStory);
    return updatedStory;
  };

  const handleOpenDelete = (story: BusinessRequirementStory) => {
    setStoryToDelete(story);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!storyToDelete || deleteLoading) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await deleteBusinessStory(storyToDelete.id);
      setStories((current) => current.filter((story) => story.id !== storyToDelete.id));
      setStoryToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : t.businessStories.deleteFailed);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExecuteStory = async (story: BusinessRequirementStory) => {
    const controller = createTrackedController();
    setExecutingStoryId(story.id);
    setExecuteError(null);
    try {
      const queuedRun = await executeBusinessStory(story.id, { signal: controller.signal });
      await pollExecutionRun(story.id, queuedRun, controller.signal);
      await loadStories({ silent: true, signal: controller.signal });
      if (historyOpen) {
        await loadHistoryStories();
      }
    } catch (err) {
      if (!isAbortError(err) && mountedRef.current && !controller.signal.aborted) {
        setExecuteError(err instanceof Error ? err.message : t.businessStories.generationFailed);
      }
    } finally {
      releaseTrackedController(controller);
      if (mountedRef.current && !controller.signal.aborted) {
        setExecutingStoryId(null);
      }
    }
  };

  const loadHistoryStories = async (signal?: AbortSignal) => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const allStories = await listBusinessStories(projectId, { include_history: true }, { signal });
      const storiesWithExecutionRuns = await Promise.all(
        allStories.map(async (story) => {
          const knownRun = executionProgressByStoryId[story.id];
          if (knownRun || !story.execution_generation_run_id) {
            return { story, run: knownRun };
          }

          try {
            return {
              story,
              run: await getGenerationRun(story.execution_generation_run_id, { signal }),
            };
          } catch {
            return { story, run: undefined };
          }
        })
      );
      const successfulHistoryStories = sortHistoryStories(
        storiesWithExecutionRuns
          .filter(({ story, run }) => isSuccessfullyExecutedStory(story, run))
          .map(({ story }) => story)
      );
      if (mountedRef.current && !signal?.aborted) {
        setHistoryStories(successfulHistoryStories);
        setSelectedHistoryStoryId((current) =>
          current && successfulHistoryStories.some((story) => story.id === current)
            ? current
            : successfulHistoryStories[0]?.id ?? null
        );
      }
    } catch (err) {
      if (!isAbortError(err) && mountedRef.current) {
        setHistoryError(getBusinessStoryErrorMessage(err, t.projectPages.changeSets.historyLoadFailed, t));
      }
    } finally {
      if (mountedRef.current && !signal?.aborted) {
        setHistoryLoading(false);
      }
    }
  };

  const handleToggleHistory = () => {
    const nextOpen = !historyOpen;
    setHistoryOpen(nextOpen);
    if (nextOpen && !historyLoading) {
      const controller = createTrackedController();
      void loadHistoryStories(controller.signal).finally(() => releaseTrackedController(controller));
    }
  };

  useEffect(() => {
    const controller = createTrackedController();
    const timer = window.setTimeout(() => {
      void loadStories({ signal: controller.signal });
    }, 0);
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadStories({ silent: true, signal: controller.signal });
      }
    }, projectRefreshIntervalMs);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadStories({ silent: true, signal: controller.signal });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      controller.abort();
      releaseTrackedController(controller);
      window.clearTimeout(timer);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    const abortControllers = abortControllersRef.current;

    return () => {
      abortControllers.forEach((controller) => controller.abort());
      abortControllers.clear();
    };
  }, []);

  return (
    <div className="relative space-y-6 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <div className="space-y-4 lg:min-h-0 lg:flex-1 lg:flex lg:flex-col">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute right-0 top-0 z-10"
          aria-expanded={historyOpen}
          onClick={handleToggleHistory}
        >
          <History className="size-4" aria-hidden="true" />
          {t.businessStories.history}
        </Button>
        <div className="flex flex-col gap-1 pt-12 md:flex-row md:flex-wrap md:items-start md:gap-4 md:pt-0 md:pr-44">
          <label className="flex w-fit max-w-full flex-col gap-1.5 text-xs font-medium text-muted-foreground">
            <span>{t.businessStories.priority}</span>
            <Select
              value={priorityFilter || allFilterValue}
              onValueChange={(value) => {
                setPriorityFilter(value === allFilterValue ? "" : (value as BusinessStoryPriority));
              }}
            >
              <SelectTrigger className="h-8 w-52 rounded-xl border-border px-2 py-1 font-normal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allFilterValue}>{t.businessStories.all}</SelectItem>
                <SelectItem value="p1_must">P1</SelectItem>
                <SelectItem value="p2_should">P2</SelectItem>
                <SelectItem value="p3_could">P3</SelectItem>
                <SelectItem value="p4_wont">P4</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="flex w-fit max-w-full flex-col gap-1.5 text-xs font-medium text-muted-foreground">
            <span>{t.businessStories.impactScope}</span>
              <Select
              value={scopeFilter || allFilterValue}
              onValueChange={(value) => {
                setScopeFilter(
                  value === allFilterValue
                    ? ""
                    : (value as (typeof businessStoryImpactScopeOptions)[number])
                );
              }}
            >
              <SelectTrigger className="h-8 w-52 rounded-xl border-border px-2 py-1 font-normal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allFilterValue}>{t.businessStories.all}</SelectItem>
                {businessStoryImpactScopeOptions.map((value) => (
                  <SelectItem key={value} value={value}>
                    {getBusinessStoryImpactScopeLabel(value, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="flex w-fit max-w-full flex-col gap-1.5 text-xs font-medium text-muted-foreground">
            <span>{t.businessStories.keyword}</span>
            <Input
              className="h-8 w-80 rounded-xl px-2 py-1 font-normal"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
              }}
              placeholder={t.businessStories.searchPlaceholder}
            />
          </label>
        </div>
        <div className="grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-stretch">
          <StoryIndexPanel
            stories={filteredCurrentStories}
            activeStoryId={storyTargetId}
            onStorySelect={handleSelectStory}
          />
          <div className="min-w-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
            <Card className="lg:flex lg:h-full lg:min-h-0 lg:flex-1 lg:flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PanelTopOpen className="size-5 text-muted-foreground" aria-hidden="true" />
                  {t.businessStories.storyDetails}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-4">
                {executeError ? <ErrorState title={t.businessStories.executeFailed} message={executeError} /> : null}
                {loading ? <LoadingState label={t.businessStories.loadingStories} /> : null}
                {!loading && error ? <ErrorState message={error} actionLabel={t.common.reload} onAction={loadStories} /> : null}
                {showCurrentStoryList && !loading && !error ? (
                  <BusinessStoryList
                    stories={filteredCurrentStories}
                    targetStoryId={storyTargetId}
                    scrollRequestKey={storyScrollRequestKey}
                    onUpdateStory={handleUpdateStory}
                    onPriorityChange={handlePriorityChange}
                    onExecuteStory={handleExecuteStory}
                    executingStoryId={executingStoryId}
                    hasExecutingStory={hasExecutingStory}
                    executionProgressByStoryId={executionProgressByStoryId}
                    failedExecutionStatuses={[...failedGenerationRunStatuses]}
                    onDeleteStory={handleOpenDelete}
                  />
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(storyToDelete)}
        title={t.businessStories.deleteTitle}
        description={t.businessStories.deleteDescription(storyToDelete?.title ?? t.businessStories.fallbackStory)}
        confirmText={t.businessStories.confirmDelete}
        cancelText={t.businessStories.cancel}
        loading={deleteLoading}
        destructive
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onOpenChange={(open) => {
          if (!open) {
            setStoryToDelete(null);
            setDeleteError(null);
          }
        }}
      />
      {historyOpen && typeof document !== "undefined"
        ? createPortal(
            <ExecutionHistoryCard
              stories={historyStories}
              loading={historyLoading}
              error={historyError}
              selectedStoryId={selectedHistoryStoryId}
              storyVersionById={storyVersionById}
              onSelectStory={setSelectedHistoryStoryId}
              onClose={() => setHistoryOpen(false)}
              onRetry={() => {
                void loadHistoryStories();
              }}
            />,
            document.body
          )
        : null}
    </div>
  );
}
