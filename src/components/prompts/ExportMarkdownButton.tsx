"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { exportContextPack } from "@/lib/api/context-packs";

export function ExportMarkdownButton({ contextPackId }: { contextPackId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await exportContextPack(contextPackId);
      const blob = new Blob([result.content], { type: result.content_type || "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.filename || "context-pack.md";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "导出 Markdown 失败 请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button type="button" variant="outline" size="sm" onClick={handleExport} disabled={loading}>
        {loading ? "正在导出..." : "导出 Markdown"}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
