"use client";

import { useRouter } from "next/navigation";

import { useLanguage } from "@/components/language/language-provider";
import { ProjectForm } from "@/components/project/ProjectForm";
import { createProject } from "@/lib/api/projects";
import type { CreateProjectPayload } from "@/lib/types/project";

export default function NewProjectPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (payload: CreateProjectPayload) => {
    const project = await createProject(payload);
    router.push(`/projects/${project.id}`);
    return project;
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t.projectForm.pageTitle}</h1>
      </div>
      <ProjectForm onSubmit={handleSubmit} />
    </div>
  );
}
