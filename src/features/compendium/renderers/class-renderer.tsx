import type { ReactNode } from "react";
import type { Class } from "@/compendium";
import type { ClassFeatureRef, ClassTableGroup } from "@/types/compendium";
import { Section } from "@/components/ui/Section";
import { Stack } from "@/components/ui/Stack";
import { Badge } from "@/components/ui/Badge";
import { HelpTip } from "@/components/ui/HelpTip";
import { EntityMetadataGrid, EntityProperty } from "@/components/ui/entity-property";
import { TableBlock } from "@/components/content/blocks/table-block";
import { t } from "@/i18n";

interface ClassRendererProps {
  readonly entity: Class;
}

const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"] as const;

function abilityLabel(ability: string): string {
  const key = ABILITY_KEYS.find((k) => ability.toLowerCase().startsWith(k));
  return key ? t(`class.ability.${key}`) : ability;
}

function abilityList(abilities: readonly string[]): string {
  return abilities.map(abilityLabel).join(", ");
}

/** Renders "2 of arcana, deception, ..." for the skill proficiency choices. */
function formatSkillChoice(skill: {
  readonly from: readonly string[];
  readonly count: number;
}): string {
  return `${skill.count} \u00d7 ${skill.from.join(", ")}`;
}

interface ChipListProps {
  readonly values: readonly string[];
  readonly tone?: "default" | "subtle";
}

/** Skill/proficiency names come from the SRD in English, so they render as chips. */
function ChipList({ values, tone = "subtle" }: ChipListProps) {
  if (values.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {values.map((value) => (
        <li key={value}>
          <Badge variant={tone}>{value}</Badge>
        </li>
      ))}
    </ul>
  );
}

interface ProficienciesBlockProps {
  readonly label: string;
  readonly values: readonly string[];
}

/** A titled group of proficiency chips. */
function ProficienciesBlock({ label, values }: ProficienciesBlockProps) {
  if (values.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>
        <ChipList values={values} />
      </dd>
    </div>
  );
}

function renderTableGroup(group: ClassTableGroup): ReactNode {
  const header = group.colLabels.length > 0 ? group.colLabels : [""];
  return (
    <div className="space-y-1">
      {group.title && (
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {group.title}
        </h3>
      )}
      <TableBlock
        headers={header.map((label) => ({ text: label || "\u2014" }))}
        rows={group.rows.map((row, rowIndex) => {
          const cells = [...row];
          while (cells.length < header.length) cells.push(null);
          return cells.map((cell, colIndex) => ({
            // Column 0 is the class level; the remaining cells are that level's values.
            text:
              cell === null || cell === ""
                ? colIndex === 0
                  ? String(rowIndex)
                  : "\u2014"
                : String(cell),
            align: "center" as const,
          }));
        })}
      />
    </div>
  );
}

export function ClassRenderer({ entity }: ClassRendererProps) {
  const { hitDice, primaryAbility, proficiency, spellcastingAbility } = entity;
  const { startingProficiencies, startingEquipment, classFeatures, classTableGroups } = entity;

  const featuresByLevel = new Map<number, ClassFeatureRef[]>();
  for (const feature of classFeatures) {
    const bucket = featuresByLevel.get(feature.level);
    if (bucket) bucket.push(feature);
    else featuresByLevel.set(feature.level, [feature]);
  }
  const levels = [...featuresByLevel.keys()].sort((a, b) => a - b);

  const hasProficiencies =
    startingProficiencies.armor.length > 0 ||
    startingProficiencies.weapons.length > 0 ||
    startingProficiencies.tools.length > 0 ||
    startingProficiencies.skills.length > 0;

  const hasEquipment = startingEquipment.groups.length > 0;

  return (
    <Stack gap="lg">
      <EntityMetadataGrid>
        <EntityProperty
          label={t("class.hitDice")}
          value={`${hitDice.number}d${hitDice.faces}`}
          stat
        />
        {primaryAbility.length > 0 && (
          <EntityProperty label={t("class.primaryAbility")} value={abilityList(primaryAbility)} />
        )}
        {spellcastingAbility && (
          <EntityProperty
            label={t("class.spellcastingAbility")}
            value={abilityLabel(spellcastingAbility)}
          />
        )}
        {proficiency.length > 0 && (
          <EntityProperty
            label={t("class.proficiencySavingThrows")}
            value={abilityList(proficiency)}
          />
        )}
        {entity.casterProgression && (
          <EntityProperty label={t("class.casterProgression")} value={entity.casterProgression} />
        )}
      </EntityMetadataGrid>

      {hasProficiencies && (
        <Section title={t("class.startingProficiencies")}>
          <dl className="grid gap-4 sm:grid-cols-2">
            <ProficienciesBlock label={t("equipment.armor")} values={startingProficiencies.armor} />
            <ProficienciesBlock
              label={t("equipment.weapons")}
              values={startingProficiencies.weapons}
            />
            <ProficienciesBlock label={t("equipment.tools")} values={startingProficiencies.tools} />
            {startingProficiencies.skills.length > 0 && (
              <ProficienciesBlock
                label={t("character.skills")}
                values={startingProficiencies.skills.map(formatSkillChoice)}
              />
            )}
          </dl>
        </Section>
      )}

      {hasEquipment && (
        <Section title={t("class.startingEquipment")}>
          <Stack gap="sm">
            {startingEquipment.groups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="space-y-2 rounded-card border border-border bg-surface p-3"
              >
                {group.alternatives.length > 1 && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <HelpTip label={t("class.chooseOne")}>{t("class.chooseOne")}</HelpTip>
                  </p>
                )}
                <ul className="grid gap-3 sm:grid-cols-2">
                  {group.alternatives.map((alternative, altIndex) => (
                    <li key={`${alternative.label}-${altIndex}`} className="space-y-1">
                      {alternative.label && (
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                          {alternative.label}
                        </span>
                      )}
                      {alternative.items.length > 0 && <ChipList values={alternative.items} />}
                      {alternative.gold && (
                        <span className="block text-xs text-muted-foreground">
                          {alternative.gold}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {startingEquipment.goldAlternative && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{t("class.goldAlternative")}:</span>{" "}
                {startingEquipment.goldAlternative}
              </p>
            )}
            {startingEquipment.additionalFromBackground && (
              <p className="text-xs text-muted-foreground">{t("class.additionalFromBackground")}</p>
            )}
          </Stack>
        </Section>
      )}

      {classTableGroups.length > 0 && (
        <Section title={t("class.progression")}>
          <Stack gap="md">
            {classTableGroups.map((group, index) => (
              <div key={index}>{renderTableGroup(group)}</div>
            ))}
          </Stack>
        </Section>
      )}

      {levels.length > 0 && (
        <Section title={t("character.classFeatures")}>
          <Stack gap="sm">
            {levels.map((level) => (
              <div key={level} className="border-l-2 border-border pl-3">
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {t("class.level")} {level}
                </h3>
                <ul className="space-y-1">
                  {featuresByLevel.get(level)!.map((feature) => (
                    <li key={feature.name} className="flex flex-wrap items-baseline gap-2">
                      <span className="text-sm font-medium">{feature.name}</span>
                      {feature.gainSubclassFeature && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Badge variant="outline">{t("class.subclassAt")}</Badge>
                          <span className="hidden sm:inline">{t("class.subclassAtHint")}</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Stack>
        </Section>
      )}

      {entity.multiclassing && (
        <Section title={t("class.multiclassing")}>
          <dl className="grid gap-4 sm:grid-cols-2">
            {entity.multiclassing.requirements.length > 0 && (
              <ProficienciesBlock
                label={t("class.multiclassingRequirements")}
                values={entity.multiclassing.requirements.map(
                  (req) => `${abilityLabel(req.ability)} ${req.score}+`,
                )}
              />
            )}
            {entity.multiclassing.proficienciesGained.length > 0 && (
              <ProficienciesBlock
                label={t("class.multiclassingGains")}
                values={entity.multiclassing.proficienciesGained}
              />
            )}
          </dl>
        </Section>
      )}

      {entity.subclassGroups.length > 0 && (
        <Section title={entity.subclassTitle ?? t("character.subclasses")}>
          <ul className="space-y-1">
            {entity.subclassGroups.map((group) => (
              <li key={group.name} className="text-sm">
                {group.name}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </Stack>
  );
}
