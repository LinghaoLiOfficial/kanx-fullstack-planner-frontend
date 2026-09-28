"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoadingState } from "@/components/common/LoadingState";
import { useAuth } from "@/components/auth/AuthProvider";

type RedirectByRoleProps = {
  children?: React.ReactNode;
  redirectTo?: string;
};

export function RedirectByRole({ children, redirectTo }: RedirectByRoleProps) {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    router.replace(redirectTo ?? "/projects");
  }, [loading, redirectTo, router, user]);

  if (loading) {
    return <LoadingState label="正在恢复登录态..." />;
  }

  if (user) {
    return <LoadingState label="正在跳转..." />;
  }

  return children ?? null;
}
