"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

import { useLanguage } from "@/components/language/language-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getProjectNavHref, getProjectNavItems, projectNavGroups } from "@/components/project/project-navigation";

function ProjectNavigationContent({
  projectId,
  onNavigate,
}: {
  projectId: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="flex h-full flex-col justify-start pt-2">
      <div className="space-y-5">
        {projectNavGroups.map((group) => (
          <div key={group.labelKey} className="space-y-2">
            <p className="px-2 text-xs font-medium text-muted-foreground">
              {t.projectNav.groups[group.labelKey]}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const href = getProjectNavHref(projectId, item.segment);
                const active = pathname === href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.labelKey}
                    href={href}
                    prefetch={false}
                    onClick={onNavigate}
                    className={cn(
                      "flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                      active && "bg-foreground text-background hover:bg-foreground hover:text-background"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{t.projectNav.items[item.labelKey]}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectSidebar({ projectId }: { projectId: string }) {
  return (
    <aside className="hidden min-h-0 overflow-y-auto rounded-2xl border border-border/70 bg-card/80 p-3 shadow-sm lg:block">
      <ProjectNavigationContent projectId={projectId} />
    </aside>
  );
}

export function ProjectMobileNav({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const currentItem = getProjectNavItems().find((item) => pathname === getProjectNavHref(projectId, item.segment));

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full justify-between rounded-2xl">
            <span className="flex items-center gap-2">
              <Menu className="size-4" />
              {currentItem ? t.projectNav.items[currentItem.labelKey] : t.projectNav.fallbackTitle}
            </span>
            <span className="text-xs text-muted-foreground">{t.projectNav.switch}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t.projectNav.sheetTitle}</SheetTitle>
            <SheetDescription>{t.projectNav.sheetDescription}</SheetDescription>
          </SheetHeader>
          <ProjectNavigationContent projectId={projectId} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
