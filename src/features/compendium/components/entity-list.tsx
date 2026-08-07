import type { ReactNode } from "react";
import { EntityCard } from "@/components/entity";
import { EmptyResults } from "@/components/search";
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
    return <EmptyResults title={emptyMessage} action={emptyAction} />;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {entities.map((entity) => (
        <EntityCard key={entity.href} {...entity} />
      ))}
    </div>
  );
}
