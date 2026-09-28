"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";

import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { TechStackConfigCard } from "@/components/blueprint/TechStackConfigCard";
import { useLanguage } from "@/components/language/language-provider";
import { FieldHint } from "@/components/ui/field-hint";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getProjectConfig, updateProjectConfig } from "@/lib/api/project-config";
import type { ProjectConfig } from "@/lib/types/project-config";
import type { LLMPromptLanguage } from "@/lib/types/project";
import type { TechStackItem } from "@/lib/types/tech-stack";

export default function ProjectConfigPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const { t } = useLanguage();
  const [config, setConfig] = useState<ProjectConfig | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [llmPromptLanguage, setLlmPromptLanguage] = useState<LLMPromptLanguage>("zh-CN");
  const [frontendStack, setFrontendStack] = useState<TechStackItem[]>([]);
  const [backendStack, setBackendStack] = useState<TechStackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadConfig = async () => {
    setLoading(true);
    setError(null);
    setSaveError(null);
    try {
      const data = await getProjectConfig(projectId);
      setConfig(data);
      setProjectName(data.project_name || data.name);
      setProjectDescription(data.project_description ?? data.description ?? "");
      setLlmPromptLanguage(data.llm_prompt_language ?? "zh-CN");
      setFrontendStack(data.target_frontend_stack_items);
      setBackendStack(data.target_backend_stack_items);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.projectPages.config.loadFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    const normalizedName = projectName.trim();
    if (!normalizedName) {
      setSaveError(t.projectPages.config.nameRequired);
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateProjectConfig(projectId, {
        project_name: normalizedName,
        project_description: projectDescription.trim() || null,
        llm_prompt_language: llmPromptLanguage,
        target_frontend_stack_items: frontendStack,
        target_backend_stack_items: backendStack,
      });
      setConfig(updated);
      setProjectName(updated.project_name || updated.name);
      setProjectDescription(updated.project_description ?? updated.description ?? "");
      setLlmPromptLanguage(updated.llm_prompt_language ?? "zh-CN");
      setFrontendStack(updated.target_frontend_stack_items);
      setBackendStack(updated.target_backend_stack_items);
      toast.success(t.projectPages.config.saved);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t.projectPages.config.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (loading) {
    return <LoadingState label={t.projectPages.config.loading} />;
  }

  if (error || !config) {
    return <ErrorState title={t.projectPages.config.unavailable} message={error || t.projectPages.config.missing} actionLabel={t.common.reload} onAction={loadConfig} />;
  }

  return (
    <div className="space-y-6 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:gap-6 lg:space-y-0">
      <Card className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="size-5 text-muted-foreground" aria-hidden="true" />
            {t.projectPages.config.formTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-4">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="group space-y-2 md:col-span-2">
              <FieldHint
                label={t.projectPages.config.projectName}
                htmlFor="project-config-name"
                hint={t.projectPages.config.projectNameHint}
              />
              <Input
                id="project-config-name"
                value={projectName}
                disabled={saving}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder={t.projectPages.config.projectNamePlaceholder}
              />
            </div>
            <fieldset className="space-y-2 md:col-span-2">
              <legend className="text-sm font-medium">{t.projectPages.config.developmentLanguage}</legend>
              <p className="text-sm text-muted-foreground">
                {t.projectPages.config.developmentLanguageHint}
              </p>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: "zh-CN", label: t.projectPages.config.languageZh },
                  { value: "en", label: t.projectPages.config.languageEn },
                ] as Array<{ value: LLMPromptLanguage; label: string }>).map((option) => (
                  <label
                    key={option.value}
                    className="flex w-32 cursor-default items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition has-[:checked]:border-foreground has-[:checked]:bg-muted has-[:checked]:text-foreground"
                  >
                    <input
                      type="radio"
                      name="project-config-llm-prompt-language"
                      className="size-4 accent-foreground"
                      checked={llmPromptLanguage === option.value}
                      disabled
                      readOnly
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="group space-y-2 md:col-span-2">
              <FieldHint
                label={t.projectPages.config.projectDescription}
                htmlFor="project-config-description"
                hint={t.projectPages.config.projectDescriptionHint}
              />
              <Textarea
                id="project-config-description"
                className="min-h-28"
                value={projectDescription}
                disabled={saving}
                onChange={(event) => setProjectDescription(event.target.value)}
                placeholder={t.projectPages.config.projectDescriptionPlaceholder}
              />
            </div>
          </div>

          <TechStackConfigCard
            frontendStack={frontendStack}
            backendStack={backendStack}
            saving={saving}
            error={saveError}
            onFrontendStackChange={setFrontendStack}
            onBackendStackChange={setBackendStack}
            onSave={handleSaveConfig}
          />
        </CardContent>
      </Card>
    </div>
  );
}
