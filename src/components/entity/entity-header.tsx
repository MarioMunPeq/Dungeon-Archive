import type { ReactNode } from "react";
import { Title, Subtitle } from "@/components/ui/Typography";

interface EntityHeaderProps {
  readonly name: string;
  readonly subtitle: ReactNode;
}

export function EntityHeader({ name, subtitle }: EntityHeaderProps) {
  return (
    <div className="space-y-1">
      <Title>{name}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </div>
  );
}
