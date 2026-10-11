import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EntityPropertyProps {
  readonly label: string;
  readonly value: ReactNode;
  readonly stat?: boolean;
  /** Rendered next to the label, e.g. a `HelpTip`. */
  readonly children?: ReactNode;
}

export function EntityProperty({ label, value, stat = false, children }: EntityPropertyProps) {
  return (
    <div className="space-y-1">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {label}
        {children}
      </dt>
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
