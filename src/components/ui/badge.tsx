import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  children,
}: {
  className?: string;
  tone?: "default" | "ok" | "warn" | "danger" | "muted";
  children: ReactNode;
}) {
  const tones = {
    default: "bg-accent-soft text-accent",
    ok: "bg-accent-soft text-ok",
    warn: "bg-bg-warm text-warn",
    danger: "bg-bg-warm text-danger",
    muted: "bg-bg-warm text-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
