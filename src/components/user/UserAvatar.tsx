"use client";

import { cn } from "@/lib/utils";

type UserAvatarProps = {
  username: string;
  displayName?: string | null;
  bgColor?: string | null;
  size?: "sm" | "md" | "lg";
};

const fallbackColors = [
  "#2563eb",
  "#059669",
  "#dc2626",
  "#7c3aed",
  "#c2410c",
  "#0f766e",
  "#be123c",
  "#4338ca",
];

const sizeClassName = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-xl",
};

function getStableColor(seed: string) {
  const source = seed || "user";
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) % fallbackColors.length;
  }

  return fallbackColors[Math.abs(hash)];
}

export function UserAvatar({
  username,
  displayName,
  bgColor,
  size = "md",
}: UserAvatarProps) {
  const label = (displayName || username || "U").trim();
  const initial = label.charAt(0).toUpperCase() || "U";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-sm",
        sizeClassName[size]
      )}
      style={{ backgroundColor: bgColor || getStableColor(username) }}
      aria-label={`${label} 的头像`}
    >
      {initial}
    </span>
  );
}
