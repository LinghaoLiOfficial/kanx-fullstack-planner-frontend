import type { ReactNode } from "react";

import { ProjectMobileNav, ProjectSidebar } from "@/components/project/ProjectSidebar";

export function ProjectWorkspaceShell({
  children,
  projectId,
}: {
  children: ReactNode;
  projectId: string;
}) {
  return (
    <div className="grid gap-6 pb-12 transition-[gap,opacity] duration-300 ease-out lg:min-h-0 lg:flex-1 lg:grid-cols-[260px_minmax(0,1fr)] lg:overflow-hidden lg:pb-0 motion-reduce:transition-none">
      <ProjectSidebar projectId={projectId} />
      <div className="min-w-0 space-y-5 lg:flex lg:min-h-0 lg:flex-col lg:space-y-0 lg:overflow-hidden lg:rounded-2xl lg:border lg:border-border/70 lg:bg-card/80 lg:shadow-sm">
        <ProjectMobileNav projectId={projectId} />
        <div className="min-w-0 lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:px-6 lg:py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
