"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MailPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { RedirectByRole } from "@/components/auth/RedirectByRole";
import { useAuth } from "@/components/auth/AuthProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendRegisterCode } from "@/lib/api/auth";
import { isStrongPassword } from "@/lib/auth/password";

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithCode } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => setCountdown((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const canSubmit = useMemo(
    () =>
      Boolean(email.trim()) &&
      Boolean(code.trim()) &&
      Boolean(username.trim()) &&
      isStrongPassword(password) &&
      password === confirmPassword,
    [code, confirmPassword, email, password, username]
  );

  const handleSendCode = async () => {
    if (!email.trim()) {
      setError("请输入邮箱");
      return;
    }

    setSendingCode(true);
    setError(null);
    setMessage(null);

    try {
      const response = await sendRegisterCode({ email: email.trim() });
      setMessage(response.message || "验证码已发送，请查收邮箱");
      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送验证码失败");
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isStrongPassword(password)) {
      setError("密码强度不符合要求");
      return;
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await registerWithCode({
        email: email.trim(),
        username: username.trim(),
        password,
        verification_code: code.trim(),
      });
      router.replace("/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RedirectByRole redirectTo="/projects">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-10 md:px-10 lg:px-12">
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1fr]">
          <section className="flex flex-col justify-center rounded-[1.75rem] border border-border/60 bg-card/80 p-8 shadow-sm">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
              <MailPlus className="size-4" />
              邮箱验证码注册
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight">
              注册
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              输入邮箱获取验证码，设置强密码后即可进入项目工作台。
            </p>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>创建账号</CardTitle>
              <CardDescription>验证码不会在前端明文展示</CardDescription>
            </CardHeader>
            <CardContent>
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

                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      disabled={submitting}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="min-w-28"
                      disabled={sendingCode || countdown > 0 || submitting}
                      onClick={handleSendCode}
                    >
                      {countdown > 0 ? `${countdown}s` : sendingCode ? "发送中..." : "发送验证码"}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">验证码</Label>
                    <Input
                      id="code"
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      autoComplete="one-time-code"
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-username">用户名</Label>
                    <Input
                      id="register-username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      autoComplete="username"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-password">密码</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="new-password"
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">确认密码</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      autoComplete="new-password"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={!canSubmit || submitting}>
                  {submitting ? "正在注册并登录..." : "注册"}
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                已有账号？{" "}
                <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                  去登录
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </RedirectByRole>
  );
}
