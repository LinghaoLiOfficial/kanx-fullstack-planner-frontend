import { cn } from "@/lib/utils";
import type { ApiContractFieldDefinition } from "@/lib/api-contract-contract";

export function ApiContractFieldHeading({
  definition,
  className,
  titleClassName,
  showMeaning = true,
}: {
  definition: ApiContractFieldDefinition;
  className?: string;
  titleClassName?: string;
  showMeaning?: boolean;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className={cn("flex flex-wrap items-center gap-2", titleClassName)}>
        <span>{definition.chineseName}</span>
      </div>
      {showMeaning ? (
        <p className="text-sm font-normal leading-6 text-muted-foreground">{definition.meaning}</p>
      ) : null}
    </div>
  );
}

export function ApiContractFieldBlock({
  definition,
  children,
  className,
}: {
  definition: ApiContractFieldDefinition;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <ApiContractFieldHeading definition={definition} />
      {children}
    </div>
  );
}
