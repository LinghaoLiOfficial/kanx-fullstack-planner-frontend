import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Component,
  DatabaseZap,
  Layers3,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

const featureCards = [
  {
    icon: Boxes,
    title: "应用级目录结构",
    description: "内置 route groups、features 分层和页面边界文件，方便长期维护。",
  },
  {
    icon: Component,
    title: "UI 基础组件就绪",
    description: "已接入 shadcn/ui 风格组件、主题变量与通用工具函数。",
  },
  {
    icon: Palette,
    title: "Tailwind CSS 4 变量主题",
    description: "基于 design tokens 的语义化主题，支持快速品牌定制。",
  },
  {
    icon: ShieldCheck,
    title: "环境变量与边界处理",
    description: "包含 Zod 校验、loading、error、not-found 等页面级边界。",
  },
  {
    icon: DatabaseZap,
    title: "数据层基础设施",
    description: "内置 React Query、请求封装与 Zustand，便于快速接业务。",
  },
  {
    icon: Layers3,
    title: "官网与控制台双场景",
    description: "同时覆盖 landing page 和 dashboard 两类核心前端场景。",
  },
];

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/80 px-6 py-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur md:px-10 md:py-14">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-amber-600" />
            fullstack-forge-frontend 已准备就绪
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              为 fullstack-forge 构建统一的官网与后台前端体验。
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              当前仓库已经整理为 fullstack-forge-frontend 的项目基础工程，包含路由分层、
              组件基座、状态管理、数据访问、表单校验与页面边界能力。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="rounded-full border border-border px-3 py-1">
              App Name: {env.NEXT_PUBLIC_APP_NAME}
            </span>
            <span className="rounded-full border border-border px-3 py-1">
              API Base URL: {env.NEXT_PUBLIC_API_BASE_URL}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/dashboard">
                打开控制台
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={siteConfig.links.docs} target="_blank">
                查看 Next.js 文档
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {featureCards.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-border/70 bg-background/85 p-5"
            >
              <item.icon className="mb-4 size-5 text-amber-700" />
              <h2 className="text-lg font-medium">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
