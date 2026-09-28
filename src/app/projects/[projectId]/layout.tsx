"use client";

import { useParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { ProjectWorkspaceShell } from "@/components/project/ProjectWorkspaceShell";
import { recordProjectOpened } from "@/lib/api/projects";

export default function ProjectDetailLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  useEffect(() => {
    void recordProjectOpened(projectId).catch(() => {
      // Opening-time tracking should not block access to a project.
    });
  }, [projectId]);

  return <ProjectWorkspaceShell projectId={projectId}>{children}</ProjectWorkspaceShell>;
}
