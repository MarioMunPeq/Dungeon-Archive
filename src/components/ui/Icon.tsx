import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type IconSize = "xs" | "sm" | "md" | "lg";

interface IconBaseProps {
  readonly children: ReactNode;
  readonly size?: IconSize;
  readonly className?: string;
  readonly label?: string;
}

export type IconProps = Omit<IconBaseProps, "children">;

const SIZE_CLASSES: Record<IconSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function Icon({ children, size = "sm", className, label }: IconBaseProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden={label ? undefined : "true"}
      role={label ? "img" : undefined}
      className={cn("shrink-0", SIZE_CLASSES[size], className)}
    >
      {label ? <title>{label}</title> : null}
      {children}
    </svg>
  );
}
