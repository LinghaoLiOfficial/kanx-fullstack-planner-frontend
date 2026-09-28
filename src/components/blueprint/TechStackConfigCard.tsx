"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

import { useLanguage } from "@/components/language/language-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldHint } from "@/components/ui/field-hint";
import { Input } from "@/components/ui/input";
import type { TechStackItem } from "@/lib/types/tech-stack";

type TechStackTypeLabels = Record<TechStackItem["type"], string>;

function createTechStackItem(name: string): TechStackItem {
  return {
    name: name.trim(),
    type: "framework",
    tags: [],
    role: null,
  };
}

function appendStackItem(items: TechStackItem[], name: string) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return items;
  }
  if (items.some((item) => item.name.toLowerCase() === normalizedName.toLowerCase())) {
    return items;
  }
  return [...items, createTechStackItem(normalizedName)];
}

function StackItemRow({
  item,
  disabled,
  onRemove,
}: {
  item: TechStackItem;
  disabled?: boolean;
  onRemove: () => void;
}) {
  const { t } = useLanguage();
  const typeLabels: TechStackTypeLabels = {
    framework: t.forms.techStack.framework,
    language: t.forms.techStack.language,
    ui_library: t.forms.techStack.uiLibrary,
    package_manager: t.forms.techStack.packageManager,
    database: t.forms.techStack.database,
    orm: t.forms.techStack.orm,
    migration_tool: t.forms.techStack.migrationTool,
    runtime: t.forms.techStack.runtime,
    build_tool: t.forms.techStack.buildTool,
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border/60 px-3 py-2">
      <span className="font-medium text-foreground">{item.name}</span>
      <Badge variant="secondary">{typeLabels[item.type]}</Badge>
      {item.tags?.length ? (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
      {item.role ? <span className="text-xs text-muted-foreground">{item.role}</span> : null}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-auto size-7"
        disabled={disabled}
        onClick={onRemove}
        aria-label={t.forms.techStack.remove(item.name)}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

function StackColumn({
  title,
  description,
  items,
  placeholder,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  items: TechStackItem[];
  placeholder: string;
  disabled?: boolean;
  onChange: (items: TechStackItem[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const { t } = useLanguage();

  const handleAdd = () => {
    const nextItems = appendStackItem(items, draft);
    if (nextItems !== items) {
      onChange(nextItems);
    }
    setDraft("");
  };

  return (
    <div className="group relative space-y-3">
      <div>
        <FieldHint label={title} hint={description} />
      </div>
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <StackItemRow
              key={`${item.type}:${item.name}:${index}`}
              item={item}
              disabled={disabled}
              onRemove={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            />
          ))
        ) : (
          <div className="rounded-md border border-dashed border-border/60 px-3 py-4 text-sm text-muted-foreground">
            {t.forms.techStack.defaultStack}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" size="icon" disabled={disabled || !draft.trim()} onClick={handleAdd}>
          <Plus className="size-4" />
          <span className="sr-only">{t.forms.techStack.addItem}</span>
        </Button>
      </div>
    </div>
  );
}

export function TechStackConfigCard({
  frontendStack,
  backendStack,
  saving = false,
  error,
  onFrontendStackChange,
  onBackendStackChange,
  onSave,
}: {
  frontendStack: TechStackItem[];
  backendStack: TechStackItem[];
  saving?: boolean;
  error?: string | null;
  onFrontendStackChange: (items: TechStackItem[]) => void;
  onBackendStackChange: (items: TechStackItem[]) => void;
  onSave: () => void | Promise<void>;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <StackColumn
          title={t.forms.techStack.frontendTitle}
          description={t.forms.techStack.frontendDescription}
          items={frontendStack}
          placeholder={t.forms.techStack.frontendPlaceholder}
          disabled={saving}
          onChange={onFrontendStackChange}
        />
        <StackColumn
          title={t.forms.techStack.backendTitle}
          description={t.forms.techStack.backendDescription}
          items={backendStack}
          placeholder={t.forms.techStack.backendPlaceholder}
          disabled={saving}
          onChange={onBackendStackChange}
        />
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => void onSave()} disabled={saving}>
          {t.forms.techStack.saveConfig}
        </Button>
      </div>
    </div>
  );
}
