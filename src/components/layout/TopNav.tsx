"use client";

import Link from "next/link";
import Image from "next/image";
import { FileText, FolderKanban, Plus, Users } from "lucide-react";

import { useAuth } from "@/components/auth/AuthProvider";
import { LanguageSelect } from "@/components/language/LanguageSelect";
import { useLanguage } from "@/components/language/language-provider";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UserMenu } from "@/components/user/UserMenu";
import { cn } from "@/lib/utils";

export function TopNav({ compactGap = false }: { compactGap?: boolean }) {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  return (
    <header
      className={cn(
        "z-40 shrink-0 transition-[margin,top] duration-300 ease-out motion-reduce:transition-none",
        compactGap ? "relative" : "sticky top-6 mb-8"
      )}
    >
      <div className="rounded-full border border-border/70 bg-background/85 px-4 py-3 shadow-sm backdrop-blur transition-[border-radius,box-shadow,background-color] duration-300 ease-out motion-reduce:transition-none">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt={t.app.name}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
              priority
            />
            <div>
              <div className="text-xs text-muted-foreground">{t.topNav.brandKicker}</div>
              <div className="font-medium">{t.app.name}</div>
            </div>
          </Link>

          <div className="flex items-center justify-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/projects">
                <FolderKanban className="size-4" />
                {t.topNav.projects}
              </Link>
            </Button>
            {isAdmin ? (
              <>
                <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                  <Link href="/users">
                    <Users className="size-4" />
                    {t.topNav.users}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex">
                  <Link href="/llm-prompt-templates">
                    <FileText className="size-4" />
                    {t.topNav.promptTemplates}
                  </Link>
                </Button>
              </>
            ) : null}
            <Button asChild size="sm">
              <Link href="/projects/new">
                <Plus className="size-4" />
                {t.topNav.new}
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-end gap-2">
            <UserMenu />
            <LanguageSelect />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
