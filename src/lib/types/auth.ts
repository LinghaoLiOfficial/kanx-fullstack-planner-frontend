import type { CurrentUser } from "@/lib/types/user";

export type SendRegisterCodeInput = {
  email: string;
};

export type RegisterInput = {
  email: string;
  username: string;
  password: string;
  verification_code: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type UpdateMeInput = {
  username?: string;
  display_name?: string | null;
  preferred_locale?: "zh-CN" | "en";
  password?: string;
};

export type AuthUserResponse = {
  user: CurrentUser;
};

export type MessageResponse = {
  message: string;
};
