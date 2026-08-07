import type { ReactNode } from "react";
import { EntityCard } from "@/components/entity";
import { EmptyResults } from "@/components/search";
import { VirtualGrid } from "@/components/virtual";
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
    <VirtualGrid
      items={entities}
      getItemKey={(entity) => entity.href}
      renderItem={(entity) => <EntityCard {...entity} />}
      columnCount={2}
      gap={8}
      estimateRowHeight={96}
    />
  );
}
