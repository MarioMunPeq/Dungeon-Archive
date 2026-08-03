import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type InlineGap = "xs" | "sm" | "md" | "lg";
type InlineAlign = "start" | "center" | "end" | "baseline" | "stretch";

const GAP_CLASSES: Record<InlineGap, string> = {
  xs: "gap-2",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

const ALIGN_CLASSES: Record<InlineAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
};

interface InlineProps {
  readonly gap?: InlineGap;
  readonly align?: InlineAlign;
  readonly wrap?: boolean;
  readonly className?: string;
  readonly children?: ReactNode;
}

export function Inline({
  gap = "sm",
  align = "center",
  wrap = true,
  className,
  children,
}: InlineProps) {
  return (
    <div
      className={cn("flex", ALIGN_CLASSES[align], GAP_CLASSES[gap], wrap && "flex-wrap", className)}
    >
      {children}
    </div>
  );
}
