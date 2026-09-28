"use client";

import { toast } from "sonner";

import { useLanguage } from "@/components/language/language-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyButton({ value, label, className }: CopyButtonProps) {
  const { t } = useLanguage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t.common.copiedToClipboard);
    } catch {
      toast.error(t.common.copyFailed);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" className={cn(className)} onClick={handleCopy}>
      {label ?? t.common.copyJson}
    </Button>
  );
}
