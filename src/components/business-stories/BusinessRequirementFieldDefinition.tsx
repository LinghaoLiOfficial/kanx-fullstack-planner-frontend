import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language/language-provider";
import { FieldHint } from "@/components/ui/field-hint";
import type { BusinessRequirementFieldDefinition } from "@/lib/types/business-story";

export function FieldDefinitionHeading({
  definition,
  className,
  titleClassName,
  showMeaning = true,
}: {
  definition: BusinessRequirementFieldDefinition;
  className?: string;
  titleClassName?: string;
  showMeaning?: boolean;
}) {
  const { locale } = useLanguage();
  const label = locale === "en" ? definition.englishName : definition.name;
  const hint = locale === "en" ? undefined : definition.meaning;

  return (
    <div className={cn("space-y-1", className)}>
      <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", titleClassName)}>
        {showMeaning && hint ? (
          <FieldHint
            label={label}
            hint={hint}
            labelClassName="text-inherit"
          />
        ) : (
          <span>{label}</span>
        )}
      </div>
    </div>
  );
}

export function FieldDefinitionSummary({
  definitions,
}: {
  definitions: BusinessRequirementFieldDefinition[];
}) {
  return (
    <section className="space-y-3">
      <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
        {definitions.map((definition) => (
          <div key={definition.key} className="border-l border-border pl-3">
            <FieldDefinitionHeading definition={definition} titleClassName="text-sm font-medium" />
          </div>
        ))}
      </div>
    </section>
  );
}
