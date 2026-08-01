import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EntityPropertyProps {
  readonly label: string;
  readonly value: ReactNode;
  readonly stat?: boolean;
}

export function EntityProperty({ label, value, stat = false }: EntityPropertyProps) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-sm text-foreground",
          stat && "text-lg font-bold leading-snug tabular-nums",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

interface EntityMetadataGridProps {
  readonly children: ReactNode;
}

export function EntityMetadataGrid({ children }: EntityMetadataGridProps) {
  return <dl className="flex flex-wrap gap-x-6 gap-y-3">{children}</dl>;
}
