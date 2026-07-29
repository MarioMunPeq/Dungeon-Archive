import type { ElementType, ReactNode } from "react";

type StackGap = "xs" | "sm" | "md" | "lg" | "xl";

const GAP_CLASSES: Record<StackGap, string> = {
  xs: "space-y-1",
  sm: "space-y-2",
  md: "space-y-4",
  lg: "space-y-6",
  xl: "space-y-8",
};

interface StackProps {
  readonly as?: ElementType;
  readonly gap?: StackGap;
  readonly className?: string;
  readonly children?: ReactNode;
}

export function Stack({ as: Tag = "div", gap = "md", className = "", children }: StackProps) {
  return <Tag className={`${GAP_CLASSES[gap]} ${className}`.trim()}>{children}</Tag>;
}
