"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { siteConfig } from "@/config/site";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {siteConfig.dashboardNav.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-start gap-3 rounded-2xl px-4 py-3 text-sm transition-colors hover:bg-muted",
              isActive && "bg-muted"
            )}
          >
            {item.icon ? <item.icon className="mt-0.5 size-4 shrink-0" /> : null}
            <span>
              <span className="block font-medium">{item.label}</span>
              {item.description ? (
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {item.description}
                </span>
              ) : null}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardSidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      <aside className="hidden rounded-[1.75rem] border border-border/60 bg-card/70 p-5 lg:flex lg:flex-col lg:justify-center">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">Workspace Navigation</div>
          <NavLinks />
        </div>
      </aside>

      <div className="flex items-center justify-between rounded-[1.75rem] border border-border/60 bg-card/70 p-4 lg:hidden">
        <div>
          <div className="text-sm text-muted-foreground">Mobile Navigation</div>
          <div className="font-medium">业务工作台</div>
        </div>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>导航菜单</SheetTitle>
              <SheetDescription>fullstack-forge-frontend 的移动端导航。</SheetDescription>
            </SheetHeader>
            <Separator className="my-4" />
            <NavLinks onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
