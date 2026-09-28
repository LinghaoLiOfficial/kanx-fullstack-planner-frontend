"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { useLanguage } from "@/components/language/language-provider";
import { GenerationActionPanel } from "@/components/project/GenerationActionPanel";
import { RequirementEditor } from "@/components/requirement/RequirementEditor";
import { RequirementList } from "@/components/requirement/RequirementList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listBusinessStories } from "@/lib/api/business-stories";
import { listChangeSets } from "@/lib/api/change-sets";
import { getProject } from "@/lib/api/projects";
import { listPromptPacks } from "@/lib/api/prompt-packs";
import { createProjectRequirement, getProjectRequirements } from "@/lib/api/requirements";
import { isProjectTechStackConfigured } from "@/lib/project-tech-stack";
import type { BusinessRequirementStory } from "@/lib/types/business-story";
import type { ChangeSet } from "@/lib/types/change-set";
import type { Project } from "@/lib/types/project";
import type { PromptPack } from "@/lib/types/prompt-pack";
import type { Requirement } from "@/lib/types/requirement";

function sortBusinessStories(stories: BusinessRequirementStory[]) {
  return [...stories].sort(
    (a, b) =>
      Number(Boolean(b.is_current)) - Number(Boolean(a.is_current)) ||
      (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
      Date.parse(b.updated_at) - Date.parse(a.updated_at)
  );
}

function sortByVersionDesc<T extends { version: number; created_at: string; is_current?: boolean }>(items: T[]) {
  return [...items].sort(
    (a, b) =>
      Number(Boolean(b.is_current)) - Number(Boolean(a.is_current)) ||
      b.version - a.version ||
      Date.parse(b.created_at) - Date.parse(a.created_at)
  );
}

export default function ProjectWorkspacePage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const { t } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [businessStories, setBusinessStories] = useState<BusinessRequirementStory[]>([]);
  const [changeSets, setChangeSets] = useState<ChangeSet[]>([]);
  const [promptPacks, setPromptPacks] = useState<PromptPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentBusinessStories = useMemo(
    () => sortBusinessStories(businessStories.filter((story) => story.is_current !== false)),
    [businessStories]
  );
  const currentChangeSets = useMemo(
    () => sortByVersionDesc(changeSets.filter((changeSet) => changeSet.is_current !== false)),
    [changeSets]
  );
  const currentPromptPack = useMemo(
    () => sortByVersionDesc(promptPacks)[0] ?? null,
    [promptPacks]
  );
  const isTechStackConfigured = project
    ? isProjectTechStackConfigured(project)
    : false;

  const loadWorkspace = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectData, requirementsData, storiesData, changeSetsData, promptPacksData] = await Promise.all([
        getProject(projectId),
        getProjectRequirements(projectId),
        listBusinessStories(projectId),
        listChangeSets(projectId),
        listPromptPacks(projectId),
      ]);
      setProject(projectData);
      setRequirements(requirementsData);
      setBusinessStories(storiesData);
      setChangeSets(changeSetsData);
      setPromptPacks(promptPacksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.projectPages.workspace.loadFailed);
    } finally {
      setLoading(false);
    }
  };

  const refreshRequirements = async () => {
    setRequirements(await getProjectRequirements(projectId));
  };

  const handleSaveRequirement = async (rawText: string) => {
    const requirement = await createProjectRequirement(projectId, {
      raw_text: rawText,
      language: "zh-CN",
      source_type: "manual",
    });
    await refreshRequirements();
    return requirement;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (loading) {
    return <LoadingState label={t.projectPages.workspace.loading} />;
  }

  if (error || !project) {
    return <ErrorState title={t.projectPages.workspace.unavailable} message={error || t.projectPages.workspace.missing} actionLabel={t.common.reload} onAction={loadWorkspace} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/projects">{t.projectPages.workspace.backToProjects}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}/configuration`}>{t.projectNav.items.configuration}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/projects/${projectId}/business-requirements`}>{t.projectNav.items.businessRequirements}</Link>
          </Button>
        </div>
      </div>

      <GenerationActionPanel
        projectId={projectId}
        hasCurrentStoryPool={currentBusinessStories.length > 0}
        hasCurrentChangeSet={currentChangeSets.length > 0}
        hasPromptPack={Boolean(currentPromptPack)}
        isTechStackConfigured={isTechStackConfigured}
      />

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <RequirementEditor onSave={handleSaveRequirement} />
          <Card>
            <CardHeader>
              <CardTitle>{t.projectPages.workspace.rawRequirements}</CardTitle>
              <CardDescription>{t.projectPages.workspace.recentRequirements}</CardDescription>
            </CardHeader>
            <CardContent>
              <RequirementList requirements={requirements} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.projectPages.workspace.orchestrationStatus}</CardTitle>
              <CardDescription>{t.projectPages.workspace.orchestrationDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/60 p-4">
                <p className="text-sm font-medium">{t.projectNav.items.businessRequirements}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {currentBusinessStories.length > 0 ? t.projectPages.workspace.storyPoolCount(currentBusinessStories.length) : t.projectPages.workspace.noStoryPool}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 p-4">
                <p className="text-sm font-medium">{t.projectNav.items.changeSets}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {currentChangeSets.length > 0 ? t.projectPages.workspace.changeSetCount(currentChangeSets.length) : t.projectPages.workspace.noChangeSet}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 p-4">
                <p className="text-sm font-medium">{t.projectNav.items.delivery}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {currentPromptPack ? t.projectPages.workspace.currentPromptPack(currentPromptPack.version) : t.projectPages.workspace.noPromptPack}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <Link href={`/projects/${projectId}/configuration`}>{t.projectNav.items.configuration}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/projects/${projectId}/business-requirements`}>{t.projectNav.items.businessRequirements}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/projects/${projectId}/change-sets`}>{t.projectNav.items.changeSets}</Link>
                </Button>
                <Button asChild>
                  <Link href={`/projects/${projectId}/delivery`}>{t.projectNav.items.delivery}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
