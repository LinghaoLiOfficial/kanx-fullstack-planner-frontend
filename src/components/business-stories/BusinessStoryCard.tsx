"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import {
  AffectedLayerBadge,
} from "@/components/business-stories/AffectedLayerBadge";
import { FieldDefinitionHeading } from "@/components/business-stories/BusinessRequirementFieldDefinition";
import { BusinessStoryPriorityBadge } from "@/components/business-stories/BusinessStoryPriorityBadge";
import { ImplementationScopeBadge } from "@/components/business-stories/ImplementationScopeBadge";
import { InlineEditableList } from "@/components/business-stories/InlineEditableList";
import { InlineEditableText } from "@/components/business-stories/InlineEditableText";
import { ErrorState } from "@/components/common/ErrorState";
import { useLanguage } from "@/components/language/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FieldHint } from "@/components/ui/field-hint";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { businessRequirementFieldDefinitionByKey } from "@/lib/business-story-contract";
import { cn } from "@/lib/utils";
import type {
  BusinessRequirementStory,
  BusinessStoryPriority,
  DataRule,
  UpdateBusinessStoryInput,
} from "@/lib/types/business-story";
import type { GenerationRun } from "@/lib/types/generation-run";

const priorities: BusinessStoryPriority[] = ["p1_must", "p2_should", "p3_could", "p4_wont"];
const storyTextBlockClassName =
  "cursor-text rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm leading-7 text-muted-foreground transition-colors hover:bg-muted/50";

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StorySection({
  title,
  definition,
  showMeaning = true,
  children,
}: {
  title?: string;
  definition?: Parameters<typeof FieldDefinitionHeading>[0]["definition"];
  showMeaning?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      {definition ? (
        <FieldDefinitionHeading
          definition={definition}
          showMeaning={showMeaning}
          titleClassName="text-sm font-medium"
        />
      ) : (
        <h3 className="text-sm font-medium">{title}</h3>
      )}
      {children}
    </section>
  );
}

function formatDataRulesForEditing(dataRules: DataRule[]): string {
  return dataRules
    .map((item) => (item.field ? `${item.field}：${item.rule}` : item.rule))
    .join("\n");
}

function parseDataRulesFromText(text: string): DataRule[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const colonIndex = line.indexOf(":");
      const chineseColonIndex = line.indexOf("：");
      const separatorIndex =
        colonIndex === -1
          ? chineseColonIndex
          : chineseColonIndex === -1
            ? colonIndex
            : Math.min(colonIndex, chineseColonIndex);

      if (separatorIndex > 0) {
        return {
          field: line.slice(0, separatorIndex).trim(),
          rule: line.slice(separatorIndex + 1).trim(),
        };
      }

      return { rule: line };
    })
    .filter((item) => item.rule);
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function BusinessStoryExecutionProgress({ run }: { run?: GenerationRun }) {
  const { t } = useLanguage();

  if (!run) {
    return null;
  }

  const progress = clampProgress(run.progress);
  const isWarning = ["failed", "error", "cancelled"].includes(run.status);
  const message =
    run.message ||
    (isWarning ? run.error_message || t.businessStories.generationFailed : t.businessStories.generatingChangeSet);

  return (
    <div className="mt-4 border-t border-border/60 pt-4">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className={cn("leading-5", isWarning ? "text-destructive" : "text-muted-foreground")}>
          {message.replace(/[。.…]+$/g, "")}
        </span>
        <span className="shrink-0 tabular-nums text-muted-foreground">{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isWarning ? "bg-destructive" : run.status === "completed" ? "bg-emerald-500" : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function InlineEditableDataRules({
  value,
  disabled,
  onSave,
}: {
  value: DataRule[];
  disabled?: boolean;
  onSave: (nextValue: DataRule[]) => Promise<void> | void;
}) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(formatDataRulesForEditing(value));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cancellingRef = useRef(false);

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }
  }, [editing]);

  const save = async () => {
    if (cancellingRef.current) {
      cancellingRef.current = false;
      return;
    }

    const nextValue = parseDataRulesFromText(draft);
    if (JSON.stringify(nextValue) === JSON.stringify(value)) {
      setDraft(formatDataRulesForEditing(value));
      setEditing(false);
      setError(null);
      return;
    }

    if (saving) {
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(nextValue);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.businessStories.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    if (disabled) {
      return;
    }

    setDraft(formatDataRulesForEditing(value));
    setError(null);
    setEditing(true);
  };

  if (editing) {
    return (
      <div className="space-y-2">
        <Textarea
          ref={textareaRef}
          aria-label={t.businessStories.editDataRules}
          placeholder={t.businessStories.dataRulesPlaceholder}
          value={draft}
          disabled={disabled || saving}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => void save()}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              cancellingRef.current = true;
              setDraft(formatDataRulesForEditing(value));
              setError(null);
              setEditing(false);
            }
          }}
        />
        {saving ? <p className="text-xs text-muted-foreground">{t.businessStories.saving}</p> : null}
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    );
  }

  if (value.length > 0) {
    return (
      <ul
        className={cn(storyTextBlockClassName, "space-y-2")}
        title={disabled ? undefined : t.businessStories.doubleClickToEdit}
        onDoubleClick={disabled ? undefined : startEditing}
      >
        {value.map((rule, index) => (
          <li key={`${rule.field ?? "rule"}-${index}`}>
            {rule.field ? <span className="font-medium text-foreground">{rule.field}：</span> : null}
            {rule.rule}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p
      className={storyTextBlockClassName}
      title={disabled ? undefined : t.businessStories.doubleClickToEdit}
      onDoubleClick={disabled ? undefined : startEditing}
    >
      {t.businessStories.noDataRules}
    </p>
  );
}

function InlineSelect<T extends string>({
  label,
  value,
  options,
  labels,
  disabled,
  className,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  labels: Record<T, string>;
  disabled: boolean;
  className?: string;
  onChange: (value: T) => void;
}) {
  const labelId = useId();

  return (
    <div className={cn("flex flex-col gap-1 text-xs font-medium text-muted-foreground", className)}>
      <span id={labelId}>{label}</span>
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(nextValue) => onChange(nextValue as T)}
      >
        <SelectTrigger aria-labelledby={labelId} className="h-9 rounded-full border-border shadow-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {labels[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function BusinessStoryCard({
  story,
  onUpdateStory,
  onPriorityChange,
  onExecute,
  executing,
  executionBlocked,
  executionFailed,
  executionProgress,
  onDelete,
  readOnly = false,
}: {
  story: BusinessRequirementStory;
  onUpdateStory: (storyId: string, input: UpdateBusinessStoryInput) => Promise<BusinessRequirementStory>;
  onPriorityChange: (storyId: string, priority: BusinessStoryPriority) => Promise<void>;
  onExecute?: (story: BusinessRequirementStory) => void;
  executing?: boolean;
  executionBlocked?: boolean;
  executionFailed?: boolean;
  executionProgress?: GenerationRun;
  onDelete?: (story: BusinessRequirementStory) => void;
  readOnly?: boolean;
}) {
  const { locale, t } = useLanguage();
  const [updatingField, setUpdatingField] = useState<"priority" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requirementName = story.requirement_name ?? story.title;
  const impactScope = story.impact_scope ?? {
    implementation_scope: story.implementation_scope,
    affected_layers: story.affected_layers,
  };
  const includedScope = story.included_scope ?? story.business_scope.included;
  const excludedScope = story.excluded_scope ?? story.business_scope.excluded;
  const executionNote = story.execution_note ?? story.execution_notes ?? "";

  const handlePriorityChange = async (priority: BusinessStoryPriority) => {
    if (priority === story.priority) {
      return;
    }

    setUpdatingField("priority");
    setError(null);
    try {
      await onPriorityChange(story.id, priority);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.businessStories.updatePriorityFailed);
    } finally {
      setUpdatingField(null);
    }
  };

  const handleFieldSave = async (input: UpdateBusinessStoryInput) => {
    await onUpdateStory(story.id, input);
  };

  return (
    <Card className="relative">
      {onDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label={`${t.businessStories.confirmDelete}: ${story.title}`}
          onClick={() => onDelete(story)}
        >
          <X className="size-4" />
        </Button>
      ) : null}
      <CardHeader className="pb-14 pr-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex min-w-0 items-start gap-1.5">
                <InlineEditableText
                  value={requirementName}
                  ariaLabel={t.businessStories.editRequirementName}
                  placeholder={t.businessStories.requirementNamePlaceholder}
                  minRows={1}
                  disabled={readOnly}
                  className="min-w-0 cursor-text text-xl font-semibold leading-7 transition-colors hover:text-primary"
                  onSave={(title) => handleFieldSave({ title })}
                />
                <FieldHint
                  label={businessRequirementFieldDefinitionByKey.requirement_name.name}
                  hint={businessRequirementFieldDefinitionByKey.requirement_name.meaning}
                  showLabel={false}
                  tooltipAlign="center"
                  className="mt-1 shrink-0"
                />
              </div>
              <BusinessStoryPriorityBadge priority={story.priority} />
            </div>
            {story.vertical_slice_note ? (
              <p className="pt-2 text-sm font-medium leading-7 text-[oklch(0.42_0.06_55)] dark:text-[oklch(0.82_0.08_65)]">
                {story.vertical_slice_note}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {t.businessStories.createdAt(formatDate(story.created_at, locale))}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {story.applied_at ? (
                <span>{t.businessStories.appliedAt(formatDate(story.applied_at, locale))}</span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <InlineSelect
              label={t.businessStories.priority}
              value={story.priority}
              options={priorities}
              labels={t.businessStories.priorityBadges}
              disabled={readOnly || updatingField !== null}
              className="w-24"
              onChange={handlePriorityChange}
            />
            {onExecute ? (
              <Button
                type="button"
                size="sm"
                className="ml-2 self-end"
                disabled={executing || executionBlocked}
                title={executionBlocked ? t.businessStories.blockedExecution : undefined}
                onClick={() => onExecute(story)}
              >
                {executing ? t.businessStories.executing : executionFailed ? t.businessStories.retry : t.businessStories.execute}
              </Button>
            ) : null}
          </div>
        </div>
        <BusinessStoryExecutionProgress run={executionProgress} />
      </CardHeader>
      <CardContent className="space-y-5">
        {error ? <ErrorState title={t.businessStories.updateFailed} message={error} /> : null}

        <StorySection
          definition={businessRequirementFieldDefinitionByKey.impact_scope}
          showMeaning
        >
          <div className="flex flex-wrap gap-2">
            <ImplementationScopeBadge scope={impactScope.implementation_scope} />
            {impactScope.affected_layers.length > 0 ? (
              impactScope.affected_layers.map((layer) => (
                <AffectedLayerBadge key={layer} layer={layer} />
              ))
            ) : (
              <span className="text-sm leading-7 text-muted-foreground">{t.businessStories.noAffectedLayers}</span>
            )}
          </div>
        </StorySection>

        <StorySection definition={businessRequirementFieldDefinitionByKey.user_story}>
          <InlineEditableText
            value={story.user_story}
            ariaLabel={t.businessStories.editUserStory}
            placeholder={t.businessStories.userStoryPlaceholder}
            disabled={readOnly}
            className={storyTextBlockClassName}
            onSave={(userStory) => handleFieldSave({ user_story: userStory })}
          />
        </StorySection>

        <StorySection definition={businessRequirementFieldDefinitionByKey.business_scope}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <FieldDefinitionHeading
                definition={businessRequirementFieldDefinitionByKey.included_scope}
                titleClassName="text-sm font-medium"
                showMeaning={false}
              />
              <InlineEditableList
                value={includedScope}
                ariaLabel={t.businessStories.editIncludedScope}
                placeholder={t.businessStories.includedScopePlaceholder}
                emptyText={t.businessStories.noIncludedScope}
                listClassName="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"
                emptyClassName="mt-3 text-sm text-muted-foreground"
                disabled={readOnly}
                onSave={(included) =>
                  handleFieldSave({
                    business_scope: {
                      included,
                      excluded: excludedScope,
                    },
                  })
                }
              />
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <FieldDefinitionHeading
                definition={businessRequirementFieldDefinitionByKey.excluded_scope}
                titleClassName="text-sm font-medium"
                showMeaning={false}
              />
              <InlineEditableList
                value={excludedScope}
                ariaLabel={t.businessStories.editExcludedScope}
                placeholder={t.businessStories.excludedScopePlaceholder}
                emptyText={t.businessStories.noExcludedScope}
                listClassName="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground"
                emptyClassName="mt-3 text-sm text-muted-foreground"
                disabled={readOnly}
                onSave={(excluded) =>
                  handleFieldSave({
                    business_scope: {
                      included: includedScope,
                      excluded,
                    },
                  })
                }
              />
            </div>
          </div>
        </StorySection>

        <StorySection definition={businessRequirementFieldDefinitionByKey.execution_note}>
          <InlineEditableText
            value={executionNote}
            ariaLabel={t.businessStories.editExecutionNote}
            placeholder={t.businessStories.executionNotePlaceholder}
            className={storyTextBlockClassName}
            emptyText={t.businessStories.noExecutionNote}
            disabled={readOnly}
            onSave={(executionNotes) => handleFieldSave({ execution_notes: executionNotes || null })}
          />
        </StorySection>

        <StorySection definition={businessRequirementFieldDefinitionByKey.data_rules}>
          <InlineEditableDataRules
            value={story.data_rules}
            disabled={readOnly}
            onSave={(dataRules) => handleFieldSave({ data_rules: dataRules })}
          />
        </StorySection>

        <StorySection definition={businessRequirementFieldDefinitionByKey.acceptance_criteria}>
          <InlineEditableList
            value={story.acceptance_criteria}
            ariaLabel={t.businessStories.editAcceptanceCriteria}
            ordered
            placeholder={t.businessStories.acceptanceCriteriaPlaceholder}
            emptyText={t.businessStories.noAcceptanceCriteria}
            listClassName={cn(storyTextBlockClassName, "list-decimal space-y-2 pl-9")}
            emptyClassName={storyTextBlockClassName}
            disabled={readOnly}
            onSave={(acceptanceCriteria) =>
              handleFieldSave({ acceptance_criteria: acceptanceCriteria })
            }
          />
        </StorySection>
      </CardContent>
    </Card>
  );
}
