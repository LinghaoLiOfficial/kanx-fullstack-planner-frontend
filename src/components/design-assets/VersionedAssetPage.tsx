"use client";

import { useParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import { AssetHeader } from "@/components/design-assets/AssetHeader";
import { DiffSummary } from "@/components/design-assets/DiffSummary";
import { sortAssetsByVersion, VersionList } from "@/components/design-assets/VersionList";
import { useLanguage } from "@/components/language/language-provider";
import { isAbortError, useInFlightRef, useMountedRef } from "@/lib/async-control";
import type { VersionedDesignAsset } from "@/lib/types/design-asset";
import { cn } from "@/lib/utils";

const PROJECT_REFRESH_INTERVAL_MS = 3000;

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function VersionedAssetPage<TAsset extends VersionedDesignAsset>({
  title,
  description,
  emptyDescription,
  sections,
  listAssets,
  action,
  renderContent,
  titleIcon: TitleIcon,
  versionListWidth = "default",
}: {
  title: string;
  description?: string;
  emptyDescription?: string;
  sections: Array<{ key: string; title: string }>;
  listAssets: (projectId: string, options?: { signal?: AbortSignal }) => Promise<TAsset[]>;
  action?: ReactNode;
  renderContent?: (asset: TAsset, content: Record<string, unknown>, sections: Array<{ key: string; title: string }>) => ReactNode;
  titleIcon?: LucideIcon;
  versionListWidth?: "default" | "narrow";
}) {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const { t } = useLanguage();
  const [assets, setAssets] = useState<TAsset[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useMountedRef();
  const refreshInFlightRef = useInFlightRef();

  const sortedAssets = useMemo(() => sortAssetsByVersion(assets), [assets]);
  const selectedAsset = sortedAssets.find((asset) => asset.id === selectedId) ?? sortedAssets[0] ?? null;

  const loadAssets = useCallback(async (options?: { silent?: boolean; signal?: AbortSignal }) => {
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
      const data = sortAssetsByVersion(await listAssets(projectId, { signal: options?.signal }));
      if (mountedRef.current && !options?.signal?.aborted) {
        setAssets(data);
        setSelectedId((current) => current ?? data[0]?.id ?? null);
        setError(null);
      }
    } catch (err) {
      if (isAbortError(err)) {
        return;
      }
      if (!options?.silent && mountedRef.current) {
        setError(err instanceof Error ? err.message : t.designAssets.versions.loadFailed(title));
      }
    } finally {
      if (options?.silent) {
        refreshInFlightRef.current = false;
      }
      if (!options?.silent && mountedRef.current) {
        setLoading(false);
      }
    }
  }, [listAssets, mountedRef, projectId, refreshInFlightRef, t.designAssets.versions, title]);

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAssets({ signal: controller.signal });
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadAssets({ silent: true, signal: controller.signal });
      }
    }, PROJECT_REFRESH_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadAssets({ silent: true, signal: controller.signal });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      controller.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadAssets]);

  const showHeader = Boolean(description || action);
  const gridColumns =
    versionListWidth === "narrow"
      ? "lg:grid-cols-[260px_minmax(0,1fr)]"
      : "lg:grid-cols-[320px_minmax(0,1fr)]";

  return (
    <div className="space-y-6 lg:flex lg:h-full lg:min-h-0 lg:flex-1 lg:flex-col">
      {showHeader ? (
        <div className="flex flex-wrap items-end justify-between gap-4">
          {description ? (
            <div>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
            </div>
          ) : null}
          {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
        </div>
      ) : null}

      {loading ? <LoadingState label={t.designAssets.versions.loading(title)} /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel={t.common.reload} onAction={loadAssets} /> : null}
      {!loading && !error ? (
        <div className={cn("grid gap-4 lg:h-0 lg:min-h-0 lg:flex-1 lg:items-stretch", gridColumns)}>
          <VersionList assets={sortedAssets} selectedId={selectedAsset?.id ?? null} onSelect={setSelectedId} />
          <div className="min-w-0 space-y-4 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-4">
            <AssetHeader
              asset={selectedAsset}
              emptyTitle={t.designAssets.versions.noVersion(title)}
              emptyDescription={emptyDescription}
              titleIcon={TitleIcon}
            />
            {selectedAsset ? (
              <>
                {renderContent ? (
                  renderContent(selectedAsset, asRecord(selectedAsset.content), sections)
                ) : (
                  <AssetContentSections content={asRecord(selectedAsset.content)} sections={sections} />
                )}
                <DiffSummary diff={selectedAsset.diff_from_previous ?? asRecord(selectedAsset.content).diff} />
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
