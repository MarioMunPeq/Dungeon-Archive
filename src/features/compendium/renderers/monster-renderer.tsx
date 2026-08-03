import type { Monster } from "@/compendium";
import { AbilityScores } from "./ability-scores";
import { Stack } from "@/components/ui/Stack";
import { Section } from "@/components/entity";
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

      <Section title="Ability Scores">
        <AbilityScores abilities={entity.abilities} />
      </Section>

      {entity.traits.length > 0 && (
        <Section title="Traits">
          <ContentRenderer blocks={entity.traits} />
        </Section>
      )}

      {entity.actions.length > 0 && (
        <Section title="Actions">
          <ContentRenderer blocks={entity.actions} />
        </Section>
      )}

      {entity.reactions.length > 0 && (
        <Section title="Reactions">
          <ContentRenderer blocks={entity.reactions} />
        </Section>
      )}

      {entity.legendaryActions.length > 0 && (
        <Section title="Legendary Actions">
          <ContentRenderer blocks={entity.legendaryActions} />
        </Section>
      )}

      {entity.description.length > 0 && (
        <Section title="Description">
          <ContentRenderer blocks={entity.description} />
        </Section>
      )}
    </Stack>
  );
}
