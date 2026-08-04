import type { ReactNode } from "react";
import { Display, Subtitle } from "@/components/ui/Typography";

interface EntityHeaderProps {
  readonly name: string;
  readonly subtitle: ReactNode;
}

export function EntityHeader({ name, subtitle }: EntityHeaderProps) {
  return (
    <div className="space-y-1">
      <Display>{name}</Display>
      <Subtitle>{subtitle}</Subtitle>
    </div>
  );
}
