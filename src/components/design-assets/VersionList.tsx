import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, History } from "lucide-react";

import { useLanguage } from "@/components/language/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/design-asset-labels";
import { cn } from "@/lib/utils";
import type { VersionedDesignAsset } from "@/lib/types/design-asset";

export function sortAssetsByVersion<T extends VersionedDesignAsset>(assets: T[]) {
  return [...assets].sort(
    (a, b) =>
      Number(Boolean(b.is_current)) - Number(Boolean(a.is_current)) ||
      b.version - a.version ||
      Date.parse(b.created_at) - Date.parse(a.created_at)
  );
}

function VersionTitleTooltip({
  title,
  open,
  anchorRef,
}: {
  title: string;
  open: boolean;
  anchorRef: React.RefObject<HTMLSpanElement | null>;
}) {
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (!open) {
      return;
    }

    const updatePosition = () => {
      const element = anchorRef.current;
      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();
      setPosition({
        left: rect.left + rect.width / 2,
        top: rect.top - 8,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef, open]);

  return useMemo(() => {
    if (!open) {
      return null;
    }

    return createPortal(
      <div
        className="pointer-events-none fixed z-50 w-max max-w-[min(28rem,calc(100vw-2rem))] rounded-md border border-border/70 bg-popover px-3 py-2 text-xs leading-5 text-popover-foreground shadow-md"
        style={{
          left: position.left,
          top: position.top,
          transform: "translate(-50%, -100%)",
        }}
      >
        {title}
      </div>,
      document.body
    );
  }, [open, position.left, position.top, title]);
}

function VersionListItem<T extends VersionedDesignAsset>({
  asset,
  active,
  onSelect,
  showCreatedAt,
}: {
  asset: T;
  active: boolean;
  onSelect: (id: string) => void;
  showCreatedAt: boolean;
}) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const { locale, t } = useLanguage();

  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "h-auto w-full justify-start rounded-2xl border border-border/60 px-4 py-3 text-left",
        active && "border-foreground bg-muted"
      )}
      onClick={() => onSelect(asset.id)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span className="min-w-0 flex-1 space-y-1">
        <span className="flex min-w-0 items-center gap-2">
          <span ref={titleRef} className="min-w-0 flex-1 truncate font-medium">
            {asset.title}
          </span>
          <Badge variant="outline">v{asset.version}</Badge>
        </span>
        {showCreatedAt ? (
          <span className="flex items-center gap-1.5 text-sm leading-6 text-muted-foreground">
            <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{t.common.createdAt} {formatDateTime(asset.created_at, locale)}</span>
          </span>
        ) : null}
      </span>
      <VersionTitleTooltip title={asset.title} open={open} anchorRef={titleRef} />
    </Button>
  );
}

export function VersionList<T extends VersionedDesignAsset>({
  assets,
  selectedId,
  title,
  description,
  onSelect,
  showCreatedAt = false,
}: {
  assets: T[];
  selectedId?: string | null;
  title?: string;
  description?: string;
  onSelect: (id: string) => void;
  showCreatedAt?: boolean;
}) {
  const { t } = useLanguage();
  const resolvedTitle = title ?? t.designAssets.versions.listTitle;

  return (
    <Card className="lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="size-5 text-muted-foreground" aria-hidden="true" />
          {resolvedTitle}
        </CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-4">
        {assets.length === 0 ? (
          <p className="text-sm leading-6 text-muted-foreground">{t.designAssets.versions.empty}</p>
        ) : null}
        {assets.map((asset) => {
          const active = selectedId === asset.id;

          return (
            <VersionListItem
              key={asset.id}
              asset={asset}
              active={active}
              onSelect={onSelect}
              showCreatedAt={showCreatedAt}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
