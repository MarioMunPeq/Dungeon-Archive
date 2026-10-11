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

/** Module scope so the props stay referentially stable across renders. */
function cardKey(entity: EntityCardData): string {
  return entity.href;
}

function renderCard(entity: EntityCardData): ReactNode {
  return <EntityCard {...entity} />;
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
      getItemKey={cardKey}
      renderItem={renderCard}
      columnCount={2}
      gap={8}
      estimateRowHeight={96}
    />
  );
}
