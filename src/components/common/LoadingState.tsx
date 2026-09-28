"use client";

import { useLanguage } from "@/components/language/language-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle } from "lucide-react";

export function LoadingState({ label }: { label?: string }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 rounded-[1.75rem] border border-border/60 bg-card p-6">
      <div className="text-sm text-muted-foreground">{label ?? t.common.loading}</div>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-40" />
    </div>
  );
}

export function FullScreenLoadingState({ label }: { label?: string }) {
  const { t } = useLanguage();

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex h-dvh w-full items-center justify-center bg-white/50 backdrop-blur-[2px]"
    >
      <div className="flex flex-col items-center gap-5 text-black/20">
        <LoaderCircle className="size-16 animate-spin text-black/20" aria-hidden="true" />
        <span className="text-base font-medium">{label ?? t.common.loading}</span>
      </div>
    </div>
  );
}
