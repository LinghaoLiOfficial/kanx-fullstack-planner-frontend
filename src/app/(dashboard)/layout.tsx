import type { ReactNode } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <RequireAuth>
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 md:px-10 lg:px-12">
        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <DashboardSidebar />
          <div className="space-y-4">
            <DashboardHeader />
            {children}
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
