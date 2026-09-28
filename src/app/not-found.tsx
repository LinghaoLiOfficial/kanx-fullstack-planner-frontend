import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-[2rem] border border-border/60 bg-card/80 p-8 text-center shadow-sm">
        <div className="text-sm text-muted-foreground">404</div>
        <h1 className="mt-2 text-3xl font-semibold">页面未找到</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          这是 fullstack-forge-frontend 的 not-found 页面。你可以继续替换为更贴合品牌的 404 体验。
        </p>
        <Button asChild className="mt-6">
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </main>
  );
}
