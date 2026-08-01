import type { ReactNode } from "react";
import { EntityCard } from "@/components/entity";
import type { EntityCardData } from "@/compendium";

interface EntityListProps {
  readonly entities: readonly EntityCardData[];
  readonly emptyMessage?: string;
  readonly emptyAction?: ReactNode;
}

export function EntityList({
  entities,
  emptyMessage = "No entities found",
  emptyAction,
}: EntityListProps) {
  if (entities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
        <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {entities.map((entity) => (
        <EntityCard key={entity.href} {...entity} />
      ))}
    </div>
  );
}
