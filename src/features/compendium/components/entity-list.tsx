import { EntityCard } from "@/components/entity";
import type { EntityCardData } from "@/compendium";

interface EntityListProps {
  readonly entities: readonly EntityCardData[];
  readonly emptyMessage?: string;
}

export function EntityList({ entities, emptyMessage = "No entities found" }: EntityListProps) {
  if (entities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
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
