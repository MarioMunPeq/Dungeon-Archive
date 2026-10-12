import { METADATA_SEPARATOR, extractSpellRoll, formatSchool, spellLevelLabel } from "@/compendium";
import type { Spell } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { ContentRenderer } from "@/components/content";
import { Stack } from "@/components/ui/Stack";
import { EntityProperty, EntityMetadataGrid } from "@/components/ui/entity-property";
import { HelpTip } from "@/components/ui/HelpTip";
import { RollableDice } from "@/features/dice/rollable-dice";
import { splitSpellRoll } from "@/lib/dice";
import type { TranslationKey } from "@/i18n";
import { t } from "@/i18n";
import { useBeginnerMode } from "@/user-state";

interface SpellRendererProps {
  readonly entity: Spell;
}

const COMPONENT_KEYS: Record<string, TranslationKey> = {
  V: "spell.component.verbal",
  S: "spell.component.somatic",
  M: "spell.component.material",
};

export function expandComponents(components: readonly string[]): string[] {
  return components.map((component) => {
    const match = component.match(/^([VSM])(\s*\(.*\))?$/);
    if (!match) return component;
    const key = COMPONENT_KEYS[match[1]!];
    return `${key ? t(key) : match[1]}${match[2] ?? ""}`;
  });
}

export function componentsDisplay(components: readonly string[], beginnerMode: boolean): string {
  return beginnerMode ? expandComponents(components).join(", ") : components.join(", ");
}

/**
 * The spell-specific lead for the page subtitle ("Level 3 · Evocation").
 *
 * It lives here rather than in the entity page so the spell knowledge stays in
 * the spell module; `entity-page.tsx` picks it up per category and appends the
 * category + source. Previously the renderer emitted its own `<Subtitle>`, which
 * stacked a second subtitle under the layout's.
 */
export function spellLeadSubtitle(entity: Spell): string {
  return `${spellLevelLabel(entity.level)} ${METADATA_SEPARATOR} ${formatSchool(entity.school)}`;
}

export function SpellRenderer({ entity }: SpellRendererProps) {
  const beginnerMode = useBeginnerMode();
  const roll = extractSpellRoll(entity.description);
  const spellRoll = roll ? splitSpellRoll(roll) : null;
  const componentsText = componentsDisplay(entity.components, beginnerMode);

  return (
    <Stack gap="md">
      <EntityMetadataGrid>
        {spellRoll && (
          <EntityProperty
            label={t("term.damage")}
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
        <EntityProperty label={t("spell.castingTime")} value={entity.castingTime} stat />
        <EntityProperty label={t("spell.range")} value={entity.range} stat />
        <EntityProperty label={t("spell.duration")} value={entity.duration} stat />
        <EntityProperty label={t("spell.components")} value={componentsText} />
        {entity.ritual && (
          <EntityProperty
            label={t("filter.ritual")}
            value={
              <span className="inline-flex items-center gap-1">
                {t("filter.yes")}
                <HelpTip label={t("help.ritualCasting.title")}>
                  {t("help.ritualCasting.body")}
                </HelpTip>
              </span>
            }
          />
        )}
        {entity.concentration && (
          <EntityProperty
            label={t("filter.concentration")}
            value={
              <span className="inline-flex items-center gap-1">
                {t("filter.yes")}
                <HelpTip label={t("help.concentration.title")}>
                  {t("help.concentration.body")}
                </HelpTip>
              </span>
            }
          />
        )}
        <EntityProperty label={t("spell.classes")} value={entity.classes.join(", ")} />
      </EntityMetadataGrid>

      <Section title={t("spell.description")}>
        <ContentRenderer blocks={entity.description} />
      </Section>

      {entity.higherLevels && entity.higherLevels.length > 0 && (
        <Section title={t("spell.higherLevels")}>
          <ContentRenderer blocks={entity.higherLevels} />
        </Section>
      )}
    </Stack>
  );
}
