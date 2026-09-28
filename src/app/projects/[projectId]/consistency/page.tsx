"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ConsistencyCheckPanel } from "@/components/consistency/ConsistencyCheckPanel";
import { useLanguage } from "@/components/language/language-provider";
import { Button } from "@/components/ui/button";
import { getProjectBlueprints } from "@/lib/api/blueprints";
import { getConsistencyCheck } from "@/lib/api/consistency";
import type { ConsistencyCheck } from "@/lib/types/consistency";

export default function ConsistencyPage() {
  const { t } = useLanguage();
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [check, setCheck] = useState<ConsistencyCheck | null>(null);
  const [hasBlueprint, setHasBlueprint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const blueprints = await getProjectBlueprints(projectId);
      setHasBlueprint(blueprints.length > 0);
      if (blueprints.length > 0) {
        setCheck(await getConsistencyCheck(projectId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.consistency.loadFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    setChecking(true);
    setError(null);
    try {
      setCheck(await getConsistencyCheck(projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : t.consistency.checkFailed);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            {t.consistency.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleCheck} disabled={checking || !hasBlueprint}>
            {checking ? t.consistency.checking : t.consistency.recheck}
          </Button>
        </div>
      </div>

      {loading ? <LoadingState label={t.consistency.loading} /> : null}
      {!loading && error ? <ErrorState message={error} actionLabel={t.common.reload} onAction={loadData} /> : null}
      {!loading && !error && !hasBlueprint ? (
        <EmptyState
          icon={ShieldCheck}
          title={t.consistency.prepareAssetsTitle}
          description={t.consistency.prepareAssetsDescription}
          action={<Button asChild><Link href={`/projects/${projectId}/frontend-implementation`}>{t.consistency.goToAssets}</Link></Button>}
        />
      ) : null}
      {!loading && !error && hasBlueprint ? <ConsistencyCheckPanel check={check} /> : null}
    </div>
  );
}
