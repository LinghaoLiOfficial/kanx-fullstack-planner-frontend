import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { loginSchema } from "@/features/auth/schema";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "登录参数校验失败",
        issues: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const response = NextResponse.json({
    message: "登录成功",
    user: {
      email: parsed.data.email,
      name: "Demo User",
      role: "admin",
    },
  });

  response.cookies.set(
    AUTH_COOKIE_NAME,
    JSON.stringify({
      email: parsed.data.email,
      name: "Demo User",
      role: "admin",
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    }
  );

  return response;
}
