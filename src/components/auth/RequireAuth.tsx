"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { FullScreenLoadingState } from "@/components/common/LoadingState";
import { buildLoginRequiredUrl } from "@/lib/auth/login-required";

export function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, authenticated } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      const redirectTo = `${pathname}${window.location.search}`;
      router.replace(buildLoginRequiredUrl(redirectTo));
      return;
    }
  }, [authenticated, loading, pathname, router]);

  if (loading || !authenticated) {
    return <FullScreenLoadingState label="加载中..." />;
  }

  return children;
}
