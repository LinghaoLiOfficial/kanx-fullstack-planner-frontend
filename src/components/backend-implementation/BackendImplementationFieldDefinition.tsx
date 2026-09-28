import { cn } from "@/lib/utils";
import type { BackendImplementationFieldDefinition } from "@/lib/backend-implementation-contract";

export function BackendImplementationFieldHeading({
  definition,
  className,
  titleClassName,
  showMeaning = true,
}: {
  definition: BackendImplementationFieldDefinition;
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

export function BackendImplementationFieldBlock({
  definition,
  children,
  className,
}: {
  definition: BackendImplementationFieldDefinition;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <BackendImplementationFieldHeading definition={definition} />
      {children}
    </div>
  );
}
