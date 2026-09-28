"use client";

import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/language/language-provider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function linesToStringList(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function stringListToText(items: string[]): string {
  return items.join("\n");
}

type InlineEditableListProps = {
  value: string[];
  ariaLabel: string;
  ordered?: boolean;
  placeholder?: string;
  disabled?: boolean;
  emptyText?: string;
  listClassName?: string;
  itemClassName?: string;
  emptyClassName?: string;
  onSave: (nextValue: string[]) => Promise<void> | void;
};

export function InlineEditableList({
  value,
  ariaLabel,
  ordered = false,
  placeholder,
  disabled = false,
  emptyText,
  listClassName,
  itemClassName,
  emptyClassName,
  onSave,
}: InlineEditableListProps) {
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(stringListToText(value));
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

    const nextValue = linesToStringList(draft);
    if (JSON.stringify(nextValue) === JSON.stringify(value)) {
      setDraft(stringListToText(value));
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

    setDraft(stringListToText(value));
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
          value={draft}
          disabled={disabled || saving}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => void save()}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              cancellingRef.current = true;
              setDraft(stringListToText(value));
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

  const ListTag = ordered ? "ol" : "ul";

  if (value.length === 0) {
    return (
      <p
        className={cn("cursor-text rounded-md transition-colors hover:bg-muted/50", emptyClassName)}
        title={disabled ? undefined : t.businessStories.doubleClickToEdit}
        onDoubleClick={disabled ? undefined : startEditing}
      >
        {emptyText ?? t.businessStories.noContent}
      </p>
    );
  }

  return (
    <ListTag
      className={cn("cursor-text rounded-md transition-colors hover:bg-muted/50", listClassName)}
      title={disabled ? undefined : t.businessStories.doubleClickToEdit}
      onDoubleClick={disabled ? undefined : startEditing}
    >
      {value.map((item, index) => (
        <li key={`${item}-${index}`} className={itemClassName}>
          {item}
        </li>
      ))}
    </ListTag>
  );
}
