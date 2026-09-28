import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少需要 6 位"),
});

export type LoginValues = z.infer<typeof loginSchema>;
