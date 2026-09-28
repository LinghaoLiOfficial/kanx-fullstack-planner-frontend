## 全栈上下文编排器前端

基于 `Next.js + React + TypeScript + Tailwind CSS 4 + shadcn/ui + pnpm` 构建的可联调前端工作台。

## 当前能力

- 首页产品介绍
- 项目列表与创建项目
- 项目工作台与项目内导航
- 需求输入与需求历史
- 调用后端占位接口生成 Project Blueprint
- 查看和复制格式化 Blueprint JSON
- 生成、查看、复制 API 契约草案
- 生成、查看、复制数据库模型草案
- 生成 Context Packs / Codex Prompts
- 复制 prompt_text，并导出 Markdown
- 查看一致性检查结果

## 环境变量

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

如果需要覆盖前端地址，也可以设置：

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=全栈上下文编排器
```

## 启动

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 联调流程

1. 启动后端服务，确保接口前缀为 `http://localhost:8000/api/v1`。
2. 启动前端：`pnpm dev`。
3. 打开首页，进入项目列表。
4. 创建或进入一个项目。
5. 保存自然语言需求。
6. 点击“生成蓝图草案”。
7. 点击“生成 API 契约草案”，进入 API 契约页面查看 endpoint 表格和 JSON。
8. 点击“生成数据库模型草案”，进入数据库模型页面查看 entities、fields、relationships 和 JSON。
9. 点击“生成 Context Packs”，进入 Prompts 页面查看、复制 prompt_text，并导出 Markdown。
10. 进入一致性检查页面，查看检查结果。

## 常用命令

```bash
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm start
```
