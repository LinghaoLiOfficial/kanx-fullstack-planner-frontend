"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileText, LogOut, Settings, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/components/language/language-provider";
import { UserAvatar } from "@/components/user/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function UserMenu() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { user, loading, isAdmin, logoutUser } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  if (loading) {
    return <Skeleton className="h-9 w-[5.25rem] rounded-full" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">{t.userMenu.login}</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">{t.userMenu.register}</Link>
        </Button>
      </div>
    );
  }

  const displayName = user.display_name || user.username;

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);
    await logoutUser();
    setLoggingOut(false);
    router.replace("/login");
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 text-left shadow-xs transition-colors hover:bg-muted"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserAvatar
          username={user.username}
          displayName={user.display_name}
          bgColor={user.avatar_bg_color}
          size="sm"
        />
        <span className="hidden max-w-28 truncate text-sm font-medium md:inline">
          {displayName}
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-72 rounded-[1.5rem] border border-border bg-card p-3 shadow-lg"
        >
          <div className="flex items-center gap-3 border-b border-border/70 px-2 pb-3">
            <UserAvatar
              username={user.username}
              displayName={user.display_name}
              bgColor={user.avatar_bg_color}
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{displayName}</div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
              <Badge variant="outline" className="mt-2">
                {user.role}
              </Badge>
            </div>
          </div>

          <div className="mt-2 space-y-1">
            {isAdmin ? (
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/users" onClick={() => setOpen(false)}>
                  <Settings className="size-4" />
                  {t.userMenu.users}
                </Link>
              </Button>
            ) : null}
            {isAdmin ? (
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/llm-prompt-templates" onClick={() => setOpen(false)}>
                  <FileText className="size-4" />
                  {t.userMenu.promptTemplates}
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/account" onClick={() => setOpen(false)}>
                <UserRound className="size-4" />
                {t.userMenu.account}
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              disabled={loggingOut}
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              {loggingOut ? t.userMenu.loggingOut : t.userMenu.logout}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
