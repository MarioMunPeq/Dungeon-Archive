import type { ElementType, ReactNode } from "react";
import type { SurfaceVariant } from "@/config/tokens";
import { cn } from "@/lib/utils";

const VARIANT_CLASSES: Record<SurfaceVariant, string> = {
  default: "rounded-lg border border-border bg-background p-3",
  outlined: "rounded-lg border border-border p-3",
  subtle: "rounded-lg border border-border/50 bg-muted/30 p-3",
  interactive:
    "rounded-lg border border-border p-3 transition-colors hover:bg-accent active:bg-accent/80",
};

interface SurfaceProps {
  readonly as?: ElementType;
  readonly variant?: SurfaceVariant;
  readonly className?: string;
  readonly children?: ReactNode;
}

export function Surface({
  as: Tag = "div",
  variant = "default",
  className = "",
  children,
}: SurfaceProps) {
  return <Tag className={cn(VARIANT_CLASSES[variant], className)}>{children}</Tag>;
}
