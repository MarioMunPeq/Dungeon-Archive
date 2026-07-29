import type { ElementType, ReactNode } from "react";

interface TypographyProps {
  readonly as?: ElementType;
  readonly className?: string;
  readonly children?: ReactNode;
}

export function Title({ as: Tag = "h1", className = "", children }: TypographyProps) {
  return <Tag className={`text-2xl font-bold text-foreground ${className}`.trim()}>{children}</Tag>;
}

export function Subtitle({ as: Tag = "p", className = "", children }: TypographyProps) {
  return <Tag className={`text-sm text-muted-foreground ${className}`.trim()}>{children}</Tag>;
}

export function Heading({ as: Tag = "h3", className = "", children }: TypographyProps) {
  return (
    <Tag className={`text-sm font-semibold uppercase text-muted-foreground ${className}`.trim()}>
      {children}
    </Tag>
  );
}

export function Body({ as: Tag = "p", className = "", children }: TypographyProps) {
  return <Tag className={`text-sm text-foreground ${className}`.trim()}>{children}</Tag>;
}

export function Caption({ as: Tag = "span", className = "", children }: TypographyProps) {
  return <Tag className={`text-xs text-muted-foreground ${className}`.trim()}>{children}</Tag>;
}
