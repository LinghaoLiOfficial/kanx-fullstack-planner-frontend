"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { RedirectByRole } from "@/components/auth/RedirectByRole";
import { useAuth } from "@/components/auth/AuthProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOGIN_REQUIRED_MESSAGE, LOGIN_REQUIRED_PARAM } from "@/lib/auth/login-required";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get(LOGIN_REQUIRED_PARAM) === "1") {
      toast.warning(LOGIN_REQUIRED_MESSAGE, {
        id: LOGIN_REQUIRED_PARAM,
      });
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("请输入邮箱");
      return;
    }

    if (!normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
      setError("请输入有效邮箱");
      return;
    }

    if (!password) {
      setError("请输入密码");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await loginWithPassword({
        email: normalizedEmail,
        password,
      });
      const redirectTo = new URLSearchParams(window.location.search).get("redirectTo");
      router.replace(redirectTo || "/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RedirectByRole>
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-10 md:px-10 lg:px-12">
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="flex flex-col justify-center rounded-[1.75rem] border border-border/60 bg-card/80 p-8 shadow-sm">
            <div className="inline-flex w-fit -translate-y-6 items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
              <LogIn className="size-4" />
              Monaryn
            </div>
            <h1 className="mt-0 max-w-xl text-4xl font-semibold tracking-tight">
              登录
            </h1>
          </section>

          <Card>
            <CardHeader className="pb-8">
              <CardTitle>登录账号</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    placeholder="请输入邮箱"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="请输入密码"
                    disabled={submitting}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "正在登录..." : "登录"}
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                还没有账号？{" "}
                <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
                  去注册
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </RedirectByRole>
  );
}
