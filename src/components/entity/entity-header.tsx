import type { ReactNode } from "react";
import { Title, Subtitle } from "@/components/ui/Typography";

interface EntityHeaderProps {
  readonly name: string;
  readonly subtitle: ReactNode;
  readonly source: string;
}

export function EntityHeader({ name, subtitle, source }: EntityHeaderProps) {
  return (
    <div className="space-y-1">
      <Title>{name}</Title>
      <Subtitle>{subtitle}</Subtitle>
      <span className="text-xs text-muted-foreground" aria-label="Source">
        {source}
      </span>
    </div>
  );
}
