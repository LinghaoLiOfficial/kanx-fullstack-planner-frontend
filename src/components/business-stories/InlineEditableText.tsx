"use client";

import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/language/language-provider";
import { Textarea } from "@/components/ui/textarea";

type InlineEditableTextProps = {
  value: string;
  ariaLabel: string;
  placeholder?: string;
  minRows?: number;
  disabled?: boolean;
  className?: string;
  emptyText?: string;
  onSave: (nextValue: string) => Promise<void> | void;
};

export function InlineEditableText({
  value,
  ariaLabel,
  placeholder,
  minRows = 4,
  disabled = false,
  className,
  emptyText,
  onSave,
}: InlineEditableTextProps) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
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

    const nextValue = draft.trim();
    if (nextValue === value.trim()) {
      setDraft(value);
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

    setDraft(value);
    setError(null);
    setEditing(true);
  };

  if (editing) {
    return (
      <div className="space-y-2">
        <Textarea
          ref={textareaRef}
          aria-label={ariaLabel}
          placeholder={placeholder}
          rows={minRows}
          value={draft}
          disabled={disabled || saving}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => void save()}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              cancellingRef.current = true;
              setDraft(value);
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

  return (
    <p
      className={className}
      title={disabled ? undefined : t.businessStories.doubleClickToEdit}
      onDoubleClick={disabled ? undefined : startEditing}
    >
      {value.trim() ? value : emptyText ?? t.businessStories.noContent}
    </p>
  );
}
