import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  readonly as?: ElementType;
  readonly className?: string;
  readonly children?: ReactNode;
}

export function Display({ as: Tag = "h1", className, children }: TypographyProps) {
  return (
    <Tag className={cn("font-display text-2xl font-bold text-foreground", className)}>
      {children}
    </Tag>
  );
}

export function Title({ as: Tag = "h1", className, children }: TypographyProps) {
  return <Tag className={cn("text-2xl font-bold text-foreground", className)}>{children}</Tag>;
}

export function Subtitle({ as: Tag = "p", className, children }: TypographyProps) {
  return <Tag className={cn("text-sm text-muted-foreground", className)}>{children}</Tag>;
}

export function Heading({ as: Tag = "h3", className, children }: TypographyProps) {
  return (
    <Tag className={cn("text-sm font-semibold uppercase text-muted-foreground", className)}>
      {children}
    </Tag>
  );
}

export function Body({ as: Tag = "p", className, children }: TypographyProps) {
  return <Tag className={cn("text-sm text-foreground", className)}>{children}</Tag>;
}

export function Caption({ as: Tag = "span", className, children }: TypographyProps) {
  return <Tag className={cn("text-xs text-muted-foreground", className)}>{children}</Tag>;
}
