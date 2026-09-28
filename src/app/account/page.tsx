"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";

import { PasswordRules } from "@/components/auth/PasswordRules";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/components/auth/AuthProvider";
import { AppShell } from "@/components/layout/AppShell";
import { UserAvatar } from "@/components/user/UserAvatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isStrongPassword } from "@/lib/auth/password";
import type { CurrentUser } from "@/lib/types/user";

function AccountForm({ user }: { user: CurrentUser }) {
  const { updateCurrentUser } = useAuth();
  const [username, setUsername] = useState(user.username);
  const [displayName, setDisplayName] = useState(user.display_name ?? "");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim()) {
      setError("用户名不能为空");
      return;
    }

    if (password && !isStrongPassword(password)) {
      setError("密码强度不符合要求");
      return;
    }

    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await updateCurrentUser({
        username: username.trim(),
        display_name: displayName.trim() || null,
        ...(password ? { password } : {}),
      });
      setPassword("");
      setMessage("个人资料已保存");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存个人资料失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {message ? (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="account-email">邮箱</Label>
          <Input id="account-email" value={user.email} disabled readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="account-role">角色</Label>
          <Input id="account-role" value={user.role} disabled readOnly />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="account-username">用户名</Label>
          <Input
            id="account-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            disabled={submitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="account-display-name">显示名称</Label>
          <Input
            id="account-display-name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            disabled={submitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="account-password">新密码</Label>
        <Input
          id="account-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          disabled={submitting}
        />
      </div>

      {password ? <PasswordRules password={password} /> : null}

      <Button type="submit" disabled={submitting}>
        <Save className="size-4" />
        {submitting ? "正在保存..." : "保存"}
      </Button>
    </form>
  );
}

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-6 pb-12">
          <div>
            <p className="text-sm text-muted-foreground">Account</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">个人资料</h1>
          </div>

          {user ? (
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <Card>
                <CardHeader>
                  <CardTitle>账号信息</CardTitle>
                  <CardDescription>邮箱和角色由系统管理</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <UserAvatar
                      username={user.username}
                      displayName={user.display_name}
                      bgColor={user.avatar_bg_color}
                      size="lg"
                    />
                    <div className="min-w-0">
                      <div className="truncate text-lg font-semibold">
                        {user.display_name || user.username}
                      </div>
                      <div className="truncate text-sm text-muted-foreground">{user.email}</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline">{user.role}</Badge>
                        <Badge variant={user.is_active ? "secondary" : "destructive"}>
                          {user.is_active ? "已启用" : "已禁用"}
                        </Badge>
                        <Badge variant={user.is_email_verified ? "secondary" : "outline"}>
                          {user.is_email_verified ? "邮箱已验证" : "邮箱未验证"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>编辑资料</CardTitle>
                  <CardDescription>密码留空时不会修改密码</CardDescription>
                </CardHeader>
                <CardContent>
                  <AccountForm key={user.id} user={user} />
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </AppShell>
    </RequireAuth>
  );
}
