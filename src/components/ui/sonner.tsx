"use client";

import { Toaster } from "sonner";

import { useTheme } from "@/components/theme/theme-provider";

export function Sonner() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme ?? "system"}
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "!rounded-2xl",
        },
      }}
    />
  );
}
