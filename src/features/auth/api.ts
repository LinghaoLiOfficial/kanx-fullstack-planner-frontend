import { apiRequest, ApiError } from "@/lib/api/client";
import type { LoginValues } from "@/features/auth/schema";

type SignInResponse = {
  message: string;
  user: {
    email: string;
    name: string;
    role: string;
  };
};

export async function signIn(payload: LoginValues) {
  try {
    return await apiRequest<SignInResponse>("/api/auth/login", {
      method: "POST",
      body: payload,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }

    throw error;
  }
}

export async function signOut() {
  return apiRequest<{ message: string }>("/api/auth/logout", {
    method: "POST",
  });
}
