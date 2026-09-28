"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type SavedGenerationPanelProps = {
  buttonLabel: string;
  loadingLabel: string;
  description?: string;
  successLabel?: string;
  disabled?: boolean;
  size?: "default" | "sm";
  variant?: "default" | "outline" | "secondary";
  className?: string;
  successAction?: ReactNode;
  onGenerate: () => Promise<void>;
  formatError?: (error: unknown) => string;
};

export function SavedGenerationPanel({
  buttonLabel,
  loadingLabel,
  description = "后端正在调用大模型并保存结果，生成可能需要一些时间。",
  successLabel = "已生成并保存。",
  disabled = false,
  size = "default",
  variant = "default",
  className,
  successAction,
  onGenerate,
  formatError,
}: SavedGenerationPanelProps) {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    setRunning(true);
    setError(null);
    setSuccess(false);

    try {
      await onGenerate();
      setSuccess(true);
    } catch (err) {
      setError(
        formatError
          ? formatError(err)
          : err instanceof Error
            ? err.message
            : "生成失败，请稍后重试。"
      );
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size={size}
          variant={variant}
          onClick={() => void handleGenerate()}
          disabled={disabled || running}
        >
          {running ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {running ? loadingLabel : buttonLabel}
        </Button>
        {success && successAction ? successAction : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      {error ? (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {success ? (
        <p className="mt-3 text-sm text-muted-foreground">{successLabel}</p>
      ) : null}
    </div>
  );
}
