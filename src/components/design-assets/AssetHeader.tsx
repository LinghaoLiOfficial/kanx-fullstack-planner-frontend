import type { LucideIcon } from "lucide-react";

import { useLanguage } from "@/components/language/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/design-asset-labels";
import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export function AssetHeader({
  asset,
  emptyTitle,
  emptyDescription,
  titleIcon: TitleIcon,
}: {
  asset: VersionedDesignAsset | null;
  emptyTitle?: string;
  emptyDescription?: string;
  titleIcon?: LucideIcon;
}) {
  const { locale, t } = useLanguage();
  const resolvedEmptyTitle = emptyTitle ?? t.designAssets.versions.emptyTitle;
  const resolvedEmptyDescription = emptyDescription ?? t.designAssets.versions.emptyDescription;

  if (!asset) {
    return (
      <Card>
        <CardContent className="py-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            {TitleIcon ? <TitleIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
            {resolvedEmptyTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{resolvedEmptyDescription}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {TitleIcon ? <TitleIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" /> : null}
            <h2 className="text-xl font-semibold">{asset.title}</h2>
            <Badge variant="outline">v{asset.version}</Badge>
            {asset.is_current ? <Badge>{t.designAssets.versions.current}</Badge> : null}
          </div>
          {asset.summary ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{asset.summary}</p>
          ) : null}
          <p className="mt-2 pt-4 text-sm text-muted-foreground">{formatDateTime(asset.created_at, locale)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
