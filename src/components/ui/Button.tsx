import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger" | "danger-solid";
type ButtonSize = "sm" | "md";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
  outline: "border border-border text-foreground hover:bg-accent active:bg-accent/80",
  ghost: "text-muted-foreground hover:bg-accent hover:text-foreground active:bg-accent/80",
  danger:
    "border border-destructive/40 text-destructive hover:bg-destructive/10 active:bg-destructive/20",
  "danger-solid":
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "touch-target px-3 py-2 text-xs",
  md: "touch-comfortable px-4 py-2 text-sm",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly className?: string;
  readonly children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-control font-medium transition-all duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-40",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
