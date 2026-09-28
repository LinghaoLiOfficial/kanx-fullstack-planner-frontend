import { apiRequest } from "@/lib/api/client";
import type {
  AdminUser,
  NonAdminUserRole,
  UserRole,
} from "@/lib/types/user";
import type { LLMPromptTemplateModule } from "@/lib/types/llm-prompt-template";

export type ListAdminUsersParams = {
  q?: string;
  role?: UserRole;
  is_active?: boolean;
  page?: number;
  page_size?: number;
};

export type UpdateAdminUserInput = {
  role?: NonAdminUserRole;
  is_active?: boolean;
  display_name?: string | null;
};

export function listAdminUsers(params?: ListAdminUsersParams) {
  return apiRequest<AdminUser[]>("/admin/users", {
    query: params,
  });
}

export function updateAdminUser(userId: string, input: UpdateAdminUserInput) {
  return apiRequest<AdminUser>(`/admin/users/${userId}`, {
    method: "PATCH",
    body: input,
  });
}

export function enableAdminUser(userId: string) {
  return updateAdminUser(userId, { is_active: true });
}

export function disableAdminUser(userId: string) {
  return updateAdminUser(userId, { is_active: false });
}

export function listAdminLLMPromptTemplates() {
  return apiRequest<LLMPromptTemplateModule[]>("/admin/llm-prompt-templates");
}
