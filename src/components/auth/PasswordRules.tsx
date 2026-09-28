"use client";

import { Check, X } from "lucide-react";

import { getPasswordRules } from "@/lib/auth/password";
import { cn } from "@/lib/utils";

export function PasswordRules({ password }: { password: string }) {
  const rules = getPasswordRules(password);

  return (
    <div className="grid gap-2 rounded-[1.25rem] border border-border/70 bg-muted/30 p-3 text-xs">
      {rules.map((rule) => (
        <div
          key={rule.id}
          className={cn(
            "flex items-center gap-2",
            rule.valid ? "text-emerald-600" : "text-muted-foreground"
          )}
        >
          {rule.valid ? <Check className="size-3.5" /> : <X className="size-3.5" />}
          <span>{rule.label}</span>
        </div>
      ))}
    </div>
  );
}
