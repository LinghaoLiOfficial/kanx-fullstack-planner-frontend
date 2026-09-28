import Link from "next/link";

import { useLanguage } from "@/components/language/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/types/project";

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ProjectCard({
  project,
  onDelete,
}: {
  project: Project;
  onDelete?: (project: Project) => void;
}) {
  const { locale, t } = useLanguage();

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="flex flex-1 flex-col space-y-3 text-sm text-muted-foreground">
          <p className="line-clamp-3 leading-6">
            {project.description?.trim() || t.projectsHome.noDescription}
          </p>
          <div className="mt-auto">
            <Badge variant="outline" className="whitespace-nowrap text-xs font-normal">
              {t.projectsHome.createdAt(formatDate(project.created_at, locale))}
            </Badge>
          </div>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/projects/${project.id}`}>{t.projectsHome.enter}</Link>
          </Button>
          {onDelete ? (
            <Button
              type="button"
              variant="destructive"
              className="bg-destructive/10 text-destructive shadow-none hover:bg-destructive/15"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDelete(project);
              }}
            >
              {t.projectsHome.delete}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
