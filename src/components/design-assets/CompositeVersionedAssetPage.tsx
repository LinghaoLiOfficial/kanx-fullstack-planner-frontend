"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { AssetContentSections } from "@/components/design-assets/AssetContentSections";
import { AssetHeader } from "@/components/design-assets/AssetHeader";
import { DiffSummary } from "@/components/design-assets/DiffSummary";
import { sortAssetsByVersion, VersionList } from "@/components/design-assets/VersionList";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { useLanguage } from "@/components/language/language-provider";
import { isAbortError, useInFlightRef, useMountedRef } from "@/lib/async-control";
import type { VersionedDesignAsset } from "@/lib/types/design-asset";

const PROJECT_REFRESH_INTERVAL_MS = 3000;

type AssetGroupConfig<TAsset extends VersionedDesignAsset = VersionedDesignAsset> = {
  key: string;
  title: string;
  description: string;
  emptyDescription?: string;
  listAssets: (projectId: string, options?: { signal?: AbortSignal }) => Promise<TAsset[]>;
  sections: Array<{ key: string; title: string }>;
  action?: ReactNode;
};

type AssetGroupState<TAsset extends VersionedDesignAsset = VersionedDesignAsset> = {
  assets: TAsset[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
};

export function CompositeVersionedAssetPage({
  description,
  groups,
}: {
  title: string;
  description: string;
  groups: AssetGroupConfig[];
}) {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const { t } = useLanguage();
  const mountedRef = useMountedRef();
  const refreshInFlightRef = useInFlightRef();
  const [groupStates, setGroupStates] = useState<Record<string, AssetGroupState>>(() =>
    Object.fromEntries(
      groups.map((group) => [
        group.key,
        {
          assets: [],
          selectedId: null,
          loading: true,
          error: null,
        } satisfies AssetGroupState,
      ])
    )
  );

  const loadGroup = useCallback(
    async (group: AssetGroupConfig, options?: { silent?: boolean; signal?: AbortSignal }) => {
      if (!options?.silent) {
        setGroupStates((current) => ({
          ...current,
          [group.key]: {
            ...current[group.key],
            loading: true,
            error: null,
          },
        }));
      }

      try {
        const data = sortAssetsByVersion(await group.listAssets(projectId, { signal: options?.signal }));
        if (mountedRef.current && !options?.signal?.aborted) {
          setGroupStates((current) => ({
            ...current,
            [group.key]: {
              assets: data,
              selectedId: current[group.key]?.selectedId ?? data[0]?.id ?? null,
              loading: false,
              error: null,
            },
          }));
        }
      } catch (err) {
        if (!isAbortError(err) && mountedRef.current) {
          setGroupStates((current) => ({
            ...current,
            [group.key]: {
              assets: options?.silent ? current[group.key]?.assets ?? [] : [],
              selectedId: options?.silent ? current[group.key]?.selectedId ?? null : null,
              loading: false,
              error: options?.silent
                ? current[group.key]?.error ?? null
                : err instanceof Error ? err.message : t.designAssets.versions.loadFailed(group.title),
            },
          }));
        }
      }
    },
    [mountedRef, projectId, t.designAssets.versions]
  );

  useEffect(() => {
    const controller = new AbortController();
    const initialState = Object.fromEntries(
      groups.map((group) => [
        group.key,
        {
          assets: [],
          selectedId: null,
          loading: true,
          error: null,
        } satisfies AssetGroupState,
      ])
    );

    setGroupStates(initialState);

    const loadGroups = async (options?: { silent?: boolean; signal?: AbortSignal }) => {
      if (options?.silent && refreshInFlightRef.current) {
        return;
      }
      if (options?.silent) {
        refreshInFlightRef.current = true;
      }
      try {
        await Promise.all(groups.map((group) => loadGroup(group, options)));
      } finally {
        if (options?.silent) {
          refreshInFlightRef.current = false;
        }
      }
    };

    void loadGroups({ signal: controller.signal });
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadGroups({ silent: true, signal: controller.signal });
      }
    }, PROJECT_REFRESH_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadGroups({ silent: true, signal: controller.signal });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      controller.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [groups, loadGroup, refreshInFlightRef]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => {
          const state = groupStates[group.key] ?? {
            assets: [],
            selectedId: null,
            loading: true,
            error: null,
          };
          const sortedAssets = sortAssetsByVersion(state.assets);
          const selectedAsset = sortedAssets.find((asset) => asset.id === state.selectedId) ?? sortedAssets[0] ?? null;

          return (
            <section key={group.key} className="space-y-4 rounded-2xl border border-border/60 bg-card/30 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{group.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{group.description}</p>
                </div>
                {group.action}
              </div>
              {state.loading ? <LoadingState label={t.designAssets.versions.loading(group.title)} /> : null}
              {!state.loading && state.error ? (
                <ErrorState
                  message={state.error}
                  actionLabel={t.common.reload}
                  onAction={() => {
                    void loadGroup(group);
                  }}
                />
              ) : null}
              {!state.loading && !state.error && sortedAssets.length === 0 ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  {group.emptyDescription ?? t.designAssets.versions.noVersion(group.title)}
                </p>
              ) : null}
              {!state.loading && !state.error && selectedAsset ? (
                <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                  <VersionList
                    assets={sortedAssets}
                    selectedId={selectedAsset.id}
                    title={group.title}
                    description={group.description}
                    onSelect={(id) =>
                      setGroupStates((current) => ({
                        ...current,
                        [group.key]: {
                          ...current[group.key],
                          selectedId: id,
                        },
                      }))
                    }
                  />
                  <div className="space-y-4">
                    <AssetHeader
                      asset={selectedAsset}
                      emptyTitle={t.designAssets.versions.noVersion(group.title)}
                      emptyDescription={group.emptyDescription}
                    />
                    <AssetContentSections content={selectedAsset.content as Record<string, unknown>} sections={group.sections} />
                    <DiffSummary diff={selectedAsset.diff_from_previous ?? (selectedAsset.content as Record<string, unknown>).diff} />
                  </div>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
