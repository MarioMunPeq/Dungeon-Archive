import { SCHOOL_NAMES, METADATA_SEPARATOR, extractSpellRoll } from "@/compendium";
import type { Spell } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { ContentRenderer } from "@/components/content";
import { Subtitle } from "@/components/ui/Typography";
import { Stack } from "@/components/ui/Stack";
import { EntityProperty, EntityMetadataGrid } from "@/components/ui/entity-property";

interface SpellRendererProps {
  readonly entity: Spell;
}

export function SpellRenderer({ entity }: SpellRendererProps) {
  const levelText = entity.level === 0 ? "Cantrip" : `Level ${entity.level}`;
  const schoolName = SCHOOL_NAMES[entity.school] ?? entity.school;
  const roll = extractSpellRoll(entity.description);

  return (
    <Stack gap="md">
      <Subtitle>
        {levelText} {METADATA_SEPARATOR} {schoolName}
      </Subtitle>

      <EntityMetadataGrid>
        {roll && <EntityProperty label="Damage" value={roll} stat />}
        <EntityProperty label="Casting Time" value={entity.castingTime} stat />
        <EntityProperty label="Range" value={entity.range} stat />
        <EntityProperty label="Duration" value={entity.duration} stat />
        <EntityProperty label="Components" value={entity.components.join(", ")} />
        {entity.ritual && <EntityProperty label="Ritual" value="Yes" />}
        {entity.concentration && <EntityProperty label="Concentration" value="Yes" />}
        <EntityProperty label="Classes" value={entity.classes.join(", ")} />
      </EntityMetadataGrid>

      <Section title="Description">
        <ContentRenderer blocks={entity.description} />
      </Section>

      {entity.higherLevels && entity.higherLevels.length > 0 && (
        <Section title="At Higher Levels">
          <ContentRenderer blocks={entity.higherLevels} />
        </Section>
      )}
    </Stack>
  );
}
