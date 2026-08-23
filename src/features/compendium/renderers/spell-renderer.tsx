import { SCHOOL_NAMES, METADATA_SEPARATOR, extractSpellRoll } from "@/compendium";
import type { Spell } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { ContentRenderer } from "@/components/content";
import { Subtitle } from "@/components/ui/Typography";
import { Stack } from "@/components/ui/Stack";
import { EntityProperty, EntityMetadataGrid } from "@/components/ui/entity-property";
import { HelpTip } from "@/components/ui/HelpTip";
import { RollableDice } from "@/features/dice/rollable-dice";
import { splitSpellRoll } from "@/lib/dice";
import { useBeginnerMode } from "@/user-state";

interface SpellRendererProps {
  readonly entity: Spell;
}

const COMPONENT_NAMES: Record<string, string> = {
  V: "Verbal",
  S: "Somatic",
  M: "Material",
};

export function expandComponents(components: readonly string[]): string[] {
  return components.map((component) => {
    const match = component.match(/^([VSM])(\s*\(.*\))?$/);
    if (!match) return component;
    return `${COMPONENT_NAMES[match[1]!] ?? match[1]}${match[2] ?? ""}`;
  });
}

export function componentsDisplay(components: readonly string[], beginnerMode: boolean): string {
  return beginnerMode ? expandComponents(components).join(", ") : components.join(", ");
}

export function SpellRenderer({ entity }: SpellRendererProps) {
  const beginnerMode = useBeginnerMode();
  const levelText = entity.level === 0 ? "Cantrip" : `Level ${entity.level}`;
  const schoolName = SCHOOL_NAMES[entity.school] ?? entity.school;
  const roll = extractSpellRoll(entity.description);
  const spellRoll = roll ? splitSpellRoll(roll) : null;
  const componentsText = componentsDisplay(entity.components, beginnerMode);

  return (
    <Stack gap="md">
      <Subtitle>
        {levelText} {METADATA_SEPARATOR} {schoolName}
      </Subtitle>

      <EntityMetadataGrid>
        {spellRoll && (
          <EntityProperty
            label="Damage"
            value={
              <RollableDice
                expression={spellRoll.expression}
                label={spellRoll.type}
                className="text-lg font-bold leading-snug tabular-nums"
              />
            }
            stat
          />
        )}
        <EntityProperty label="Casting Time" value={entity.castingTime} stat />
        <EntityProperty label="Range" value={entity.range} stat />
        <EntityProperty label="Duration" value={entity.duration} stat />
        <EntityProperty label="Components" value={componentsText} />
        {entity.ritual && (
          <EntityProperty
            label="Ritual"
            value={
              <span className="inline-flex items-center gap-1">
                Yes
                <HelpTip label="What is ritual casting?">
                  A ritual takes 10 extra minutes to cast, but it doesn't use a spell slot.
                </HelpTip>
              </span>
            }
          />
        )}
        {entity.concentration && (
          <EntityProperty
            label="Concentration"
            value={
              <span className="inline-flex items-center gap-1">
                Yes
                <HelpTip label="What is concentration?">
                  The spell ends early if you cast another concentration spell or lose focus.
                </HelpTip>
              </span>
            }
          />
        )}
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
