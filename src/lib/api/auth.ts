import { apiRequest } from "@/lib/api/client";
import type {
  AuthUserResponse,
  LoginInput,
  MessageResponse,
  RegisterInput,
  SendRegisterCodeInput,
  UpdateMeInput,
} from "@/lib/types/auth";
import type { CurrentUser } from "@/lib/types/user";

export function sendRegisterCode(input: SendRegisterCodeInput) {
  return apiRequest<MessageResponse>("/auth/register/code", {
    method: "POST",
    body: input,
  });
}

export async function register(input: RegisterInput) {
  const response = await apiRequest<AuthUserResponse>("/auth/register", {
    method: "POST",
    body: input,
  });

  return response;
}

export async function login(input: LoginInput) {
  const response = await apiRequest<AuthUserResponse>("/auth/login", {
    method: "POST",
    body: {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    },
  });

  return response;
}

export function logout() {
  return apiRequest<MessageResponse>("/auth/logout", {
    method: "POST",
  });
}

export function getCurrentUser(options?: { signal?: AbortSignal }) {
  return apiRequest<CurrentUser>("/auth/me", {
    redirectOnUnauthorized: false,
    signal: options?.signal,
  });
}

export function updateMe(input: UpdateMeInput) {
  return apiRequest<CurrentUser>("/auth/me", {
    method: "PATCH",
    body: input,
  });
}
