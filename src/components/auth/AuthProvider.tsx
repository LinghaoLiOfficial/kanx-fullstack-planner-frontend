"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { ApiError } from "@/lib/api/client";
import {
  getCurrentUser,
  login,
  logout,
  register,
  updateMe,
} from "@/lib/api/auth";
import { isAbortError } from "@/lib/async-control";
import type { LoginInput, RegisterInput, UpdateMeInput } from "@/lib/types/auth";
import type { CurrentUser } from "@/lib/types/user";

type AuthContextValue = {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
  loginWithPassword: (input: LoginInput) => Promise<CurrentUser>;
  registerWithCode: (input: RegisterInput) => Promise<CurrentUser>;
  logoutUser: () => Promise<void>;
  updateCurrentUser: (input: UpdateMeInput) => Promise<CurrentUser>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const AUTH_RESTORE_TIMEOUT_MS = 5000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshRequestRef = useRef(0);

  const refreshUser = useCallback(async () => {
    const requestId = refreshRequestRef.current + 1;
    refreshRequestRef.current = requestId;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), AUTH_RESTORE_TIMEOUT_MS);
    setLoading(true);
    setError(null);

    try {
      const currentUser = await getCurrentUser({ signal: controller.signal });
      if (refreshRequestRef.current === requestId) {
        setUser(currentUser);
      }
    } catch (err) {
      if (refreshRequestRef.current !== requestId) {
        return;
      }

      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
        return;
      }

      setError(isAbortError(err) ? "恢复登录态超时" : err instanceof Error ? err.message : "恢复登录态失败");
      setUser(null);
    } finally {
      window.clearTimeout(timeout);
      if (refreshRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void refreshUser());
  }, [refreshUser]);

  const loginWithPassword = useCallback(async (input: LoginInput) => {
    const response = await login(input);
    refreshRequestRef.current += 1;
    setUser(response.user);
    setLoading(false);
    setError(null);
    return response.user;
  }, []);

  const registerWithCode = useCallback(async (input: RegisterInput) => {
    await register(input);

    const response = await login({
      email: input.email,
      password: input.password,
    });
    refreshRequestRef.current += 1;
    setError(null);
    setUser(response.user);
    setLoading(false);
    return response.user;
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await logout();
    } finally {
      refreshRequestRef.current += 1;
      setUser(null);
      setLoading(false);
      setError(null);
    }
  }, []);

  const updateCurrentUser = useCallback(async (input: UpdateMeInput) => {
    const updatedUser = await updateMe(input);
    refreshRequestRef.current += 1;
    setUser(updatedUser);
    setLoading(false);
    setError(null);
    return updatedUser;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      authenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      refreshUser,
      loginWithPassword,
      registerWithCode,
      logoutUser,
      updateCurrentUser,
    }),
    [
      user,
      loading,
      error,
      refreshUser,
      loginWithPassword,
      registerWithCode,
      logoutUser,
      updateCurrentUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
