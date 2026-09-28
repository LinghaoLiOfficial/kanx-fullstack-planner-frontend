export type UserRole =
  | "user"
  | "vip-plus"
  | "vip-pro"
  | "vip-pro-max"
  | "admin";

export type NonAdminUserRole = Exclude<UserRole, "admin">;

export type CurrentUser = {
  id: string;
  email: string;
  username: string;
  display_name?: string | null;
  role: UserRole;
  is_active: boolean;
  is_email_verified: boolean;
  avatar_seed: string;
  avatar_bg_color: string;
  preferred_locale: "zh-CN" | "en";
};

export type AdminUser = {
  id: string;
  email: string;
  username: string;
  display_name?: string | null;
  role: NonAdminUserRole;
  is_active: boolean;
  is_email_verified: boolean;
  preferred_locale: "zh-CN" | "en";
  created_at: string;
  last_login_at?: string | null;
};

export type AdminUserListResponse = {
  items: AdminUser[];
  total: number;
  page: number;
  page_size: number;
};
