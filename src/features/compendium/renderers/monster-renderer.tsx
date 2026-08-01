import type { Monster } from "@/compendium";
import { AbilityScores } from "./ability-scores";
import { Stack } from "@/components/ui/Stack";
import { Heading } from "@/components/ui/Typography";
import { EntityProperty, EntityMetadataGrid } from "@/components/ui/entity-property";
import { ContentRenderer } from "@/components/content/content-renderer";

interface MonsterRendererProps {
  readonly entity: Monster;
}

export function MonsterRenderer({ entity }: MonsterRendererProps) {
  return (
    <Stack gap="lg">
      <EntityMetadataGrid>
        <EntityProperty label="Armor Class" value={entity.armorClass} stat />
        <EntityProperty label="Hit Points" value={entity.hitPoints} stat />
        <EntityProperty label="Speed" value={entity.speed} stat />
        <EntityProperty label="Challenge Rating" value={entity.challengeRating} stat />
        <EntityProperty label="Size / Type" value={`${entity.size} ${entity.monsterType}`} />
        <EntityProperty label="Alignment" value={entity.alignment.join(" ")} />
      </EntityMetadataGrid>

      <section>
        <Heading className="mb-2">Ability Scores</Heading>
        <AbilityScores abilities={entity.abilities} />
      </section>

      {entity.traits.length > 0 && (
        <section>
          <Heading className="mb-2">Traits</Heading>
          <ContentRenderer blocks={entity.traits} />
        </section>
      )}

      {entity.actions.length > 0 && (
        <section>
          <Heading className="mb-2">Actions</Heading>
          <ContentRenderer blocks={entity.actions} />
        </section>
      )}

      {entity.reactions.length > 0 && (
        <section>
          <Heading className="mb-2">Reactions</Heading>
          <ContentRenderer blocks={entity.reactions} />
        </section>
      )}

      {entity.legendaryActions.length > 0 && (
        <section>
          <Heading className="mb-2">Legendary Actions</Heading>
          <ContentRenderer blocks={entity.legendaryActions} />
        </section>
      )}

      {entity.description.length > 0 && (
        <section>
          <Heading className="mb-2">Description</Heading>
          <ContentRenderer blocks={entity.description} />
        </section>
      )}
    </Stack>
  );
}
