"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";

import { ErrorState } from "@/components/common/ErrorState";
import { useLanguage } from "@/components/language/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { generateProjectDescriptionOptions } from "@/lib/api/projects";
import type {
  CreateProjectPayload,
  LLMPromptLanguage,
  Project,
  ProjectDescriptionOption,
} from "@/lib/types/project";

type ProjectFormProps = {
  onSubmit: (payload: CreateProjectPayload) => Promise<Project>;
};

type FormStep = "input_name" | "analyzing" | "select_description" | "error";

export function ProjectForm({ onSubmit }: ProjectFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [llmPromptLanguage, setLlmPromptLanguage] = useState<LLMPromptLanguage>("zh-CN");
  const [step, setStep] = useState<FormStep>("input_name");
  const [options, setOptions] = useState<ProjectDescriptionOption[]>([]);
  const [creatingDescription, setCreatingDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzing = step === "analyzing";
  const selecting = step === "select_description";
  const locked = analyzing || selecting || creatingDescription !== null;

  const analyzeProject = async () => {
    const normalizedName = name.trim();
    setError(null);

    if (!normalizedName) {
      setError(t.projectForm.nameRequired);
      setStep("input_name");
      return;
    }

    setName(normalizedName);
    setOptions([]);
    setStep("analyzing");

    try {
      const result = await generateProjectDescriptionOptions({
        name: normalizedName,
        llm_prompt_language: llmPromptLanguage,
      });
      setOptions(result.options);
      setStep("select_description");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.projectForm.analyzeFailed);
      setStep("error");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await analyzeProject();
  };

  const handleCreate = async (description: string) => {
    setError(null);
    setCreatingDescription(description);
    try {
      await onSubmit({
        name: name.trim(),
        description,
        llm_prompt_language: llmPromptLanguage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.projectForm.createFailed);
      setStep("select_description");
    } finally {
      setCreatingDescription(null);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>{t.projectForm.cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="project-name">{t.projectForm.name}</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t.projectForm.namePlaceholder}
              disabled={locked}
              required
            />
          </div>

          <fieldset className="space-y-2" disabled={locked}>
            <legend className="text-sm font-medium">{t.projectForm.developmentLanguage}</legend>
            <div className="grid max-w-xs gap-2 sm:grid-cols-2">
              {([
                { value: "zh-CN", label: t.projectForm.languageZh },
                { value: "en", label: t.projectForm.languageEn },
              ] as Array<{ value: LLMPromptLanguage; label: string }>).map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:bg-muted has-[:checked]:border-foreground has-[:checked]:bg-muted disabled:cursor-not-allowed"
                >
                  <input
                    type="radio"
                    name="llm-prompt-language"
                    className="size-4 accent-foreground"
                    checked={llmPromptLanguage === option.value}
                    disabled={locked}
                    onChange={() => setLlmPromptLanguage(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {step === "input_name" ? <Button type="submit">{t.projectForm.create}</Button> : null}

          {analyzing ? (
            <div className="space-y-4 rounded-md border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Loader2 className="size-4 animate-spin" />
                {t.projectForm.analyzing}
              </div>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : null}

          {step === "error" && error ? (
            <ErrorState message={error} actionLabel={t.projectForm.retryAnalyze} onAction={analyzeProject} />
          ) : null}

          {selecting ? (
            <div className="space-y-3">
              <Label>{t.projectForm.description}</Label>
              {error ? <ErrorState message={error} /> : null}
              <div className="grid gap-3">
                {options.map((option, index) => {
                  const isCreating = creatingDescription === option.description;
                  return (
                    <button
                      key={option.description}
                      type="button"
                      className="rounded-md border border-border bg-background p-4 text-left text-sm leading-6 transition hover:border-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={creatingDescription !== null}
                      onClick={() => handleCreate(option.description)}
                    >
                      <span className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <span className="flex shrink-0 items-center gap-2">
                          <span className="inline-flex items-center rounded-full border border-border bg-muted/70 px-2.5 py-0.5 text-xs font-medium leading-5 text-muted-foreground shadow-sm">
                            {t.projectForm.option(index + 1)}
                          </span>
                        </span>
                        <span className="text-muted-foreground">{option.description}</span>
                      </span>
                      {isCreating ? (
                        <span className="mt-3 flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="size-4 animate-spin" />
                          {t.projectForm.creating}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
