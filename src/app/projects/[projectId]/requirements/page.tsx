"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { RequirementEditor } from "@/components/requirement/RequirementEditor";
import { RequirementList } from "@/components/requirement/RequirementList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProjectRequirement, getProjectRequirements } from "@/lib/api/requirements";
import type { Requirement } from "@/lib/types/requirement";

const REFRESH_INTERVAL_MS = 2500;

export default function RequirementsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequirements = useCallback(
    async (options?: { signal?: AbortSignal; silent?: boolean }) => {
      if (!options?.silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const data = await getProjectRequirements(projectId, { signal: options?.signal });
        if (!options?.signal?.aborted) {
          setRequirements(data);
          setError(null);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        if (!options?.silent) {
          setError(err instanceof Error ? err.message : "需求历史加载失败");
        }
      } finally {
        if (!options?.silent && !options?.signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [projectId]
  );

  const submit = async (rawText: string) => {
    const requirement = await createProjectRequirement(projectId, {
      raw_text: rawText,
      language: "zh-CN",
      source_type: "manual",
    });
    const requirementWithProgress: Requirement = {
      ...requirement,
      progress_status: "in_progress",
      business_story_generation: {
        run_id: null,
        status: "running",
        progress: 5,
        message: "已保存，等待生成敏捷业务需求",
        error_message: null,
        updated_at: new Date().toISOString(),
      },
    };
    setRequirements((current) => [requirementWithProgress, ...current]);
    await loadRequirements({ silent: true });
    return requirement;
  };

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      void loadRequirements({ signal: controller.signal });
    });
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadRequirements({ signal: controller.signal, silent: true });
      }
    }, REFRESH_INTERVAL_MS);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [loadRequirements]);

  return (
    <div className="h-full min-h-0 space-y-6 overflow-y-auto overscroll-contain pr-2 lg:pr-4">
      <Card>
        <CardHeader>
          <CardTitle>原始用户需求</CardTitle>
        </CardHeader>
        <CardContent>
          <RequirementEditor onSave={submit} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>需求历史</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <LoadingState label="正在加载需求历史" /> : null}
          {!loading && error ? (
            <ErrorState message={error} actionLabel="重新加载" onAction={loadRequirements} />
          ) : null}
          {!loading && !error ? <RequirementList requirements={requirements} /> : null}
        </CardContent>
      </Card>
    </div>
  );
}
