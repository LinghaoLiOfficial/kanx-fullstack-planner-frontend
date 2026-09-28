import { FolderKanban, Home, Plus, type LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
};

export const siteConfig = {
  name: "全栈上下文编排器",
  description:
    "将自然语言业务需求转化为适合 vibe coding 工具使用的结构化开发上下文和指令集合",
  tagline: "面向全栈开发的上下文编排工作台",
  links: {
    docs: "https://nextjs.org/docs",
    ui: "https://ui.shadcn.com/docs",
    repo: "https://github.com",
  },
  marketingNav: [
    {
      label: "首页",
      href: "/",
      icon: Home,
      description: "查看产品介绍",
    },
    {
      label: "我的项目",
      href: "/projects",
      icon: FolderKanban,
      description: "查看和进入项目工作台",
    },
    {
      label: "新建项目",
      href: "/projects/new",
      icon: Plus,
      description: "创建新的上下文编排项目",
    },
  ] satisfies NavItem[],
  dashboardNav: [] as NavItem[],
};
