import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "accent" | "outline" | "subtle";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "border-foreground bg-accent font-medium text-foreground",
  accent: "border-accent-foreground/30 bg-accent/50 text-accent-foreground",
  outline: "border-gold/25 text-gold",
  subtle: "border-transparent bg-gold/10 text-gold",
};

interface BadgeProps {
  readonly variant?: BadgeVariant;
  readonly className?: string;
  readonly children?: ReactNode;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-control border px-2 py-1 text-xs transition-colors",
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
