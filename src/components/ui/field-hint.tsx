"use client";

import { createPortal } from "react-dom";
import { CircleHelp } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function FieldHint({
  label,
  hint,
  htmlFor,
  className,
  labelClassName,
  showLabel = true,
  tooltipAlign = "start",
}: {
  label: string;
  hint: string;
  htmlFor?: string;
  className?: string;
  labelClassName?: string;
  showLabel?: boolean;
  tooltipAlign?: "start" | "center";
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  const updatePosition = useCallback(() => {
    const element = wrapperRef.current;
    if (!element) {
      return;
    }
    const rect = element.getBoundingClientRect();
    setPosition({
      left: tooltipAlign === "center" ? rect.left + rect.width / 2 : rect.left,
      top: rect.top - 8,
    });
  }, [tooltipAlign]);

  useEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();

    const handleUpdate = () => updatePosition();
    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, true);

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
    };
  }, [open, updatePosition]);

  const tooltip = useMemo(() => {
    if (!open) {
      return null;
    }

    return createPortal(
      <div
        className="pointer-events-none fixed z-50 w-max max-w-72 rounded-md border border-border/70 bg-popover px-3 py-2 text-xs leading-5 text-popover-foreground shadow-md"
        style={{
          left: position.left,
          top: position.top,
          transform:
            tooltipAlign === "center"
              ? "translate(-50%, -100%)"
              : "translateY(-100%)",
        }}
      >
        {hint}
      </div>,
      document.body,
    );
  }, [hint, open, position.left, position.top, tooltipAlign]);

  return (
    <div
      ref={wrapperRef}
      className={cn("inline-flex max-w-full items-center gap-1.5", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {showLabel ? (
        <label htmlFor={htmlFor} className={cn("text-sm font-medium leading-none", labelClassName)}>
          {label}
        </label>
      ) : (
        <span className="sr-only">{label}</span>
      )}
      <span aria-hidden="true" className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground opacity-70 transition-opacity">
        <CircleHelp className="size-4" />
      </span>
      {tooltip}
    </div>
  );
}
