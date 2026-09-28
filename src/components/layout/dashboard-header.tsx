"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { signOut } from "@/features/auth/api";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    toast.success("已退出登录");
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex items-center justify-between rounded-[1.75rem] border border-border/60 bg-card/70 p-4">
      <div>
        <div className="text-sm text-muted-foreground">fullstack-forge</div>
        <div className="text-lg font-semibold">Frontend Dashboard</div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline">新建资源</Button>
        <Button variant="ghost" onClick={handleLogout}>
          退出登录
        </Button>
      </div>
    </div>
  );
}
