"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-md rounded-[1.75rem] border border-border bg-card p-6 text-center shadow-sm">
        <h2 className="text-2xl font-semibold">出现了一些问题</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          页面加载失败，请重试；如果问题持续存在，请检查服务日志。
        </p>
        <Button className="mt-6" onClick={reset}>
          重试
        </Button>
      </div>
    </div>
  );
}
