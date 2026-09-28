import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { buildLoginRequiredUrl } from "@/lib/auth/login-required";
import { getSessionUser } from "@/lib/auth/session";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const userPromise = getSessionUser();

  return <DashboardLayoutInner userPromise={userPromise}>{children}</DashboardLayoutInner>;
}

async function DashboardLayoutInner({
  children,
  userPromise,
}: Readonly<{
  children: ReactNode;
  userPromise: ReturnType<typeof getSessionUser>;
}>) {
  const user = await userPromise;

  if (!user) {
    redirect(buildLoginRequiredUrl());
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 md:px-10 lg:px-12">
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <DashboardSidebar />
        <div className="space-y-4">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </main>
  );
}
