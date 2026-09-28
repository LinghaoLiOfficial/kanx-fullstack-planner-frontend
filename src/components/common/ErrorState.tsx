"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/components/language/language-provider";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ErrorState({
  title,
  message,
  actionLabel,
  onAction,
}: ErrorStateProps) {
  const { t } = useLanguage();

  return (
    <Alert variant="destructive">
      <AlertTitle>{title ?? t.common.requestFailed}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {actionLabel && onAction ? (
        <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Alert>
  );
}
