import type { Monster } from "@/compendium";
import { AbilityScores } from "./ability-scores";
import { EntityProperty, EntityMetadataGrid } from "@/components/ui/entity-property";
import { ContentRenderer } from "@/components/content/content-renderer";

interface MonsterRendererProps {
  readonly entity: Monster;
}

export function MonsterRenderer({ entity }: MonsterRendererProps) {
  return (
    <div className="space-y-6">
      <EntityMetadataGrid>
        <EntityProperty label="Armor Class" value={entity.armorClass} />
        <EntityProperty label="Hit Points" value={entity.hitPoints} />
        <EntityProperty label="Speed" value={entity.speed} />
        <EntityProperty label="Size / Type" value={`${entity.size} ${entity.monsterType}`} />
        <EntityProperty label="Alignment" value={entity.alignment.join(" ")} />
        <EntityProperty label="Challenge Rating" value={entity.challengeRating} />
      </EntityMetadataGrid>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
          Ability Scores
        </h3>
        <AbilityScores abilities={entity.abilities} />
      </div>

      {entity.traits.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Traits</h3>
          <ContentRenderer blocks={entity.traits} />
        </div>
      )}

      {entity.actions.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Actions</h3>
          <ContentRenderer blocks={entity.actions} />
        </div>
      )}

      {entity.reactions.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Reactions</h3>
          <ContentRenderer blocks={entity.reactions} />
        </div>
      )}

      {entity.legendaryActions.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
            Legendary Actions
          </h3>
          <ContentRenderer blocks={entity.legendaryActions} />
        </div>
      )}

      {entity.description.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
            Description
          </h3>
          <ContentRenderer blocks={entity.description} />
        </div>
      )}
    </div>
  );
}
