"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText } from "lucide-react";

import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { CopyButton } from "@/components/common/CopyButton";
import { AppShell } from "@/components/layout/AppShell";
import { useLanguage } from "@/components/language/language-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { listAdminLLMPromptTemplates } from "@/lib/api/admin";
import type { LLMPromptLanguage } from "@/lib/types/project";
import type { LLMPromptTemplateModule, LLMPromptTemplateTask } from "@/lib/types/llm-prompt-template";

const ADMIN_REFRESH_INTERVAL_MS = 30_000;

function PromptBlock({ title, value }: { title: string; value: string }) {
  const { t } = useLanguage();

  return (
    <div className="min-w-0 max-w-full space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-medium">{title}</h4>
        <CopyButton value={value} label={t.common.copy} className="h-7 px-2.5 text-xs" />
      </div>
      <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-border/70 bg-muted/40 p-4 text-xs leading-5 text-muted-foreground">
        <code>{value}</code>
      </pre>
    </div>
  );
}

function LanguageToggle({
  language,
  onLanguageChange,
}: {
  language: LLMPromptLanguage;
  onLanguageChange: (language: LLMPromptLanguage) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="inline-flex rounded-md border border-border p-1">
      {([
        { value: "zh-CN", label: t.adminPromptTemplates.languageZh },
        { value: "en", label: t.adminPromptTemplates.languageEn },
      ] as Array<{ value: LLMPromptLanguage; label: string }>).map((option) => (
        <button
          key={option.value}
          type="button"
          className={`rounded px-3 py-1.5 text-sm transition ${
            language === option.value
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted"
          }`}
          onClick={() => onLanguageChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function TemplateTaskCard({
  language,
  task,
}: {
  language: LLMPromptLanguage;
  task: LLMPromptTemplateTask;
}) {
  const { t } = useLanguage();
  const selectedVersion = task.versions?.find((version) => version.language === language);
  const systemPrompt = selectedVersion?.system_prompt ?? task.system_prompt;
  const userPromptTemplate = selectedVersion?.user_prompt_template ?? task.user_prompt_template;

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border/70 bg-background">
      <div className="p-6">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold">{task.task_label}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {task.template_name} · {task.schema_name}
            </p>
          </div>
          <Badge variant="outline">{task.run_type}</Badge>
        </div>
      </div>
      <div className="space-y-5 p-6 pt-0">
        <PromptBlock title={t.adminPromptTemplates.systemPrompt} value={systemPrompt} />
        <PromptBlock title={t.adminPromptTemplates.userPromptTemplate} value={userPromptTemplate} />
      </div>
    </div>
  );
}

function TemplateModuleSection({
  language,
  module,
}: {
  language: LLMPromptLanguage;
  module: LLMPromptTemplateModule;
}) {
  const { t } = useLanguage();

  return (
    <section className="min-w-0 max-w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
            <FileText className="size-4" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{module.module_label}</h2>
            <p className="text-sm text-muted-foreground">{module.module_key}</p>
          </div>
        </div>
        <Badge variant="secondary">{t.adminPromptTemplates.taskCount(module.tasks.length)}</Badge>
      </div>
      <div className="grid gap-4">
        {module.tasks.map((task) => (
          <TemplateTaskCard key={task.task_key} language={language} task={task} />
        ))}
      </div>
    </section>
  );
}

function AdminLLMPromptTemplatesContent() {
  const { t } = useLanguage();
  const [modules, setModules] = useState<LLMPromptTemplateModule[]>([]);
  const [language, setLanguage] = useState<LLMPromptLanguage>("zh-CN");
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = useCallback(async (options?: { showInitialLoading?: boolean }) => {
    if (options?.showInitialLoading) {
      setInitialLoading(true);
      setError(null);
    }

    try {
      setModules(await listAdminLLMPromptTemplates());
      setError(null);
    } catch (err) {
      if (options?.showInitialLoading) {
        setError(err instanceof Error ? err.message : t.adminPromptTemplates.loadFailed);
      }
    } finally {
      setInitialLoading(false);
    }
  }, [t.adminPromptTemplates.loadFailed]);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      void loadTemplates({ showInitialLoading: true });
    }, 0);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadTemplates();
      }
    }, ADMIN_REFRESH_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadTemplates();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadTemplates]);

  return (
    <div className="flex h-[calc(100vh-9.5rem)] min-h-0 flex-col gap-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{t.adminPromptTemplates.title}</h1>
        <LanguageToggle language={language} onLanguageChange={setLanguage} />
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card className="min-h-0 flex-1 overflow-hidden">
        <CardContent className="h-full overflow-y-auto p-6">
          {initialLoading && modules.length === 0 ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-border/70 p-6">
                  <div className="h-5 w-40 rounded bg-muted" />
                  <div className="mt-3 h-4 w-64 max-w-full rounded bg-muted" />
                  <div className="mt-5 h-40 rounded-lg bg-muted" />
                </div>
              ))}
            </div>
          ) : modules.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              {t.adminPromptTemplates.empty}
            </div>
          ) : (
            <div className="min-w-0 max-w-full space-y-8">
              {modules.map((module) => (
                <TemplateModuleSection
                  key={module.module_key}
                  language={language}
                  module={module}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminLLMPromptTemplatesPage() {
  return (
    <RequireAuth>
      <AppShell>
        <RequireAdmin>
          <AdminLLMPromptTemplatesContent />
        </RequireAdmin>
      </AppShell>
    </RequireAuth>
  );
}
