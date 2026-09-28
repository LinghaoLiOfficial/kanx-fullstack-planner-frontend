"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { FullScreenLoadingState } from "@/components/common/LoadingState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { buildLoginRequiredUrl } from "@/lib/auth/login-required";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading, authenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace(buildLoginRequiredUrl(window.location.pathname + window.location.search));
    }
  }, [authenticated, loading, router]);

  if (loading || !authenticated) {
    return <FullScreenLoadingState label="加载中..." />;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-10">
        <Alert variant="destructive">
          <div className="flex gap-3">
            <ShieldAlert className="mt-1 size-5 shrink-0" />
            <div className="space-y-4">
              <div>
                <AlertTitle>没有权限访问</AlertTitle>
                <AlertDescription>该模块仅 admin 角色可访问。</AlertDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/projects">返回我的项目</Link>
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return children;
}
