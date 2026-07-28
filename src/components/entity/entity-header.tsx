import type { ReactNode } from "react";

interface EntityHeaderProps {
  readonly name: string;
  readonly subtitle: ReactNode;
  readonly source: string;
}

export function EntityHeader({ name, subtitle, source }: EntityHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold text-foreground">{name}</h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <p className="text-xs text-muted-foreground">{source}</p>
    </div>
  );
}
