import { FolderPlus } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/common/EmptyState";
import { useLanguage } from "@/components/language/language-provider";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types/project";

type ProjectListProps = {
  projects: Project[];
  hasSearch?: boolean;
  onDeleteProject?: (project: Project) => void;
};

export function ProjectList({
  projects,
  hasSearch = false,
  onDeleteProject,
}: ProjectListProps) {
  const { t } = useLanguage();

  if (projects.length === 0) {
    if (hasSearch) {
      return <EmptyState title={t.projectsHome.noMatch} />;
    }

    return (
      <EmptyState
        icon={FolderPlus}
        title={t.projectsHome.emptyTitle}
        description={t.projectsHome.emptyDescription}
        action={
          <Button asChild>
            <Link href="/projects/new">{t.projectsHome.createFirst}</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={onDeleteProject}
        />
      ))}
    </div>
  );
}
