import type { ReactNode } from "react";

interface EntityPropertyProps {
  readonly label: string;
  readonly value: ReactNode;
}

export function EntityProperty({ label, value }: EntityPropertyProps) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}

interface EntityMetadataGridProps {
  readonly children: ReactNode;
}

export function EntityMetadataGrid({ children }: EntityMetadataGridProps) {
  return <dl className="flex flex-wrap gap-x-6 gap-y-3">{children}</dl>;
}
