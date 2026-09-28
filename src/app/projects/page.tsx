"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { useLanguage } from "@/components/language/language-provider";
import { ProjectList } from "@/components/project/ProjectList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteProject, listProjects } from "@/lib/api/projects";
import type { Project } from "@/lib/types/project";

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadProjects = useCallback(async (keyword: string) => {
    setLoading(true);
    setError(null);
    try {
      setProjects(await listProjects(keyword));
    } catch (err) {
      setError(err instanceof Error ? err.message : t.projectsHome.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [t.projectsHome.loadFailed]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProjects(search);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [loadProjects, search]);

  const handleOpenDelete = (project: Project) => {
    setProjectToDelete(project);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete || deleteLoading) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await deleteProject(projectToDelete.id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : t.projectsHome.deleteFailed);
      setDeleteLoading(false);
      return;
    }

    setProjectToDelete(null);
    setDeleteLoading(false);
    await loadProjects(search);
  };

  const trimmedSearch = search.trim();
  const hasSearch = trimmedSearch.length > 0;
  const loadingLabel = hasSearch ? t.projectsHome.searchingProjects : t.projectsHome.loadingProjects;

  return (
    <div className="mt-5 space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t.projectsHome.title}</h1>
        </div>
        <div className="flex w-full flex-wrap items-start gap-3 sm:w-auto">
          <div className="w-full sm:w-72">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.projectsHome.searchPlaceholder}
              aria-label={t.projectsHome.searchAriaLabel}
            />
            {loading && hasSearch ? (
              <p className="mt-2 text-sm text-muted-foreground">{t.projectsHome.searching}</p>
            ) : null}
          </div>
          <Button asChild>
            <Link href="/projects/new">{t.projectsHome.newProject}</Link>
          </Button>
        </div>
      </div>

      {loading ? <LoadingState label={loadingLabel} /> : null}
      {!loading && error ? (
        <ErrorState
          message={error}
          actionLabel={t.common.reload}
          onAction={() => void loadProjects(search)}
        />
      ) : null}
      {!loading && !error ? (
        <ProjectList
          projects={projects}
          hasSearch={hasSearch}
          onDeleteProject={handleOpenDelete}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(projectToDelete)}
        title={t.projectsHome.deleteTitle}
        description={t.projectsHome.deleteDescription}
        confirmText={t.projectsHome.confirmDelete}
        cancelText={t.businessStories.cancel}
        loading={deleteLoading}
        destructive
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onOpenChange={(open) => {
          if (!open) {
            setProjectToDelete(null);
            setDeleteError(null);
          }
        }}
      />
    </div>
  );
}
