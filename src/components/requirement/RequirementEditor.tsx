"use client";

import { FormEvent, useState } from "react";
import { ArrowUp } from "lucide-react";

import { ErrorState } from "@/components/common/ErrorState";
import { useLanguage } from "@/components/language/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Requirement } from "@/lib/types/requirement";
import { cn } from "@/lib/utils";

type RequirementEditorProps = {
  onSave: (rawText: string) => Promise<Requirement>;
  compact?: boolean;
  title?: string;
  hideLabel?: boolean;
  submitButton?: "text" | "icon";
  disabled?: boolean;
};

export function RequirementEditor({
  onSave,
  compact = false,
  title,
  hideLabel = false,
  submitButton = "text",
  disabled = false,
}: RequirementEditorProps) {
  const { t } = useLanguage();
  const [rawText, setRawText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputDisabled = disabled || saving;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (disabled) {
      return;
    }

    if (!rawText.trim()) {
      setError(t.forms.requirement.emptyError);
      return;
    }

    setSaving(true);
    try {
      await onSave(rawText.trim());
      setRawText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.forms.requirement.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <form className={cn(compact ? "space-y-2" : "space-y-4")} onSubmit={handleSubmit}>
      <div className="space-y-2">
        {hideLabel ? null : <Label htmlFor="requirement-raw-text">{t.forms.requirement.label}</Label>}
        {submitButton === "icon" ? (
          <div
            className={cn(
              "flex flex-col rounded-[1.5rem] border border-input bg-secondary/60 shadow-xs transition-all focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
              compact ? "gap-2 p-2" : "gap-3 p-3"
            )}
          >
            <Textarea
              id="requirement-raw-text"
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              placeholder={t.forms.requirement.placeholder}
              disabled={inputDisabled}
              className={cn(
                compact ? "min-h-20 py-2 leading-6" : "min-h-44",
                "resize-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0"
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={inputDisabled}
              aria-label={t.forms.requirement.save}
              className="self-end"
            >
              <ArrowUp className="size-5 stroke-[3]" aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <Textarea
            id="requirement-raw-text"
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
            placeholder={t.forms.requirement.placeholder}
            disabled={inputDisabled}
            className={compact ? "min-h-20" : "min-h-44"}
          />
        )}
      </div>
      {error ? <ErrorState message={error} /> : null}
      {submitButton === "icon" ? (
        null
      ) : (
        <Button type="submit" disabled={inputDisabled}>
          {saving ? t.forms.requirement.saving : t.forms.requirement.save}
        </Button>
      )}
    </form>
  );

  if (compact) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? t.forms.requirement.title}</CardTitle>
        <CardDescription>{t.forms.requirement.description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
