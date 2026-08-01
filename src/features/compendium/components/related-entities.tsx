import { useMemo } from "react";
import { getRelatedEntities } from "@/compendium/relationships";
import { toCardData } from "@/compendium";
import { EntityCard } from "@/components/entity";
import type { EntityCardData } from "@/compendium";

interface RelatedEntitiesProps {
  readonly canonicalId: string;
}

export function RelatedEntities({ canonicalId }: RelatedEntitiesProps) {
  const cardData = useMemo((): readonly EntityCardData[] => {
    const entities = getRelatedEntities(canonicalId);
    return entities.map((entity) => toCardData(entity.category, entity));
  }, [canonicalId]);

  if (cardData.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Related
      </h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cardData.map((card) => (
          <EntityCard key={card.href} {...card} />
        ))}
      </div>
    </div>
  );
}
