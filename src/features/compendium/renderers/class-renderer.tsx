import type { ReactNode } from "react";
import type { Class, ClassFeatureRef } from "@/compendium";
import { Section } from "@/components/ui/Section";
import { Stack } from "@/components/ui/Stack";
import { Badge } from "@/components/ui/Badge";
import { HelpTip } from "@/components/ui/HelpTip";
import { Accordion } from "@/components/ui/Accordion";
import { CopyButton } from "@/components/ui/CopyButton";
import { ContentRenderer } from "@/components/content";
import { EntityMetadataGrid, EntityProperty } from "@/components/ui/entity-property";
import { t } from "@/i18n";
import { buildLevelCards, blocksToPlainText } from "./class-levels";
import type { ClassLevelCard } from "./class-levels";

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

/** One feature row: name, subclass marker, resource cost and copy button. */
function FeatureSummary({ feature }: { readonly feature: ClassFeatureRef }): ReactNode {
  return (
    <>
      <span className="min-w-0 flex-1 text-sm font-medium">{feature.name}</span>
      {feature.consumes && (
        <span className="shrink-0 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{t("class.uses")}:</span> {feature.consumes}
        </span>
      )}
      {feature.gainSubclassFeature && <Badge variant="outline">{t("class.subclassAt")}</Badge>}
    </>
  );
}

/** The full SRD text of a single feature, plus its copy affordance. */
function FeatureBody({ feature }: { readonly feature: ClassFeatureRef }): ReactNode {
  const copyText = [feature.name, blocksToPlainText(feature.description)]
    .filter((part) => part.length > 0)
    .join("\n\n");

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <CopyButton
          text={copyText}
          label={t("class.copyFeature")}
          copiedLabel={t("class.copiedFeature")}
        />
      </div>
      {feature.gainSubclassFeature && (
        <p className="text-xs text-muted-foreground">{t("class.subclassAtHint")}</p>
      )}
      {feature.description.length > 0 ? (
        <ContentRenderer blocks={feature.description} />
      ) : (
        <p className="text-xs italic text-muted-foreground">{t("class.noDescription")}</p>
      )}
    </div>
  );
}

/** Progression values that change at a level, grouped by source table. */
function LevelStats({ card }: { readonly card: ClassLevelCard }): ReactNode {
  if (card.statGroups.length === 0) return null;
  return (
    <Stack gap="sm">
      {card.statGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-1.5">
          {group.title && (
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {group.title}
            </p>
          )}
          <ul className="flex flex-wrap gap-1.5">
            {group.stats.map((stat, statIndex) => (
              <li
                key={`${stat.label}-${statIndex}`}
                className="inline-flex items-baseline gap-1 rounded-control border border-border bg-card px-2 py-1 text-xs"
              >
                <span className="text-muted-foreground">
                  {stat.label.length > 0 ? `${stat.label}: ` : ""}
                </span>
                <span className="font-semibold">{stat.value}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Stack>
  );
}

/** One collapsible card per class level, covering the full 1-20 range. */
function LevelCard({
  card,
  defaultOpen,
}: {
  readonly card: ClassLevelCard;
  readonly defaultOpen: boolean;
}): ReactNode {
  const hasProgression = card.statGroups.length > 0;

  return (
    <Accordion
      defaultOpen={defaultOpen}
      title={
        // `shrink-0` on the level label stops "LEVEL" and the number wrapping
        // onto separate lines; the feature names take the remaining width and
        // wrap to a second line rather than truncating (rule 40).
        <span className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="shrink-0 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-primary">
            {t("class.level")} {card.level}
          </span>
          {card.features.length > 0 && (
            <span className="line-clamp-2 min-w-0 text-sm font-medium">
              {card.features.map((f) => f.name).join(" \u00b7 ")}
            </span>
          )}
        </span>
      }
      meta={
        <span className="flex items-center gap-1.5">
          {card.features.length > 0 && (
            <Badge variant="subtle">
              {card.features.length} {t("class.featureCount")}
            </Badge>
          )}
          {card.empty && <Badge variant="subtle">{t("class.nothingNew")}</Badge>}
        </span>
      }
    >
      <Stack gap="md">
        {hasProgression && (
          <div className="space-y-1.5">
            {/* Labelled "Numbers", not "Progression by Level" — the outer
                section already carries that title and repeating it read as a
                duplicate heading on every level card. */}
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("class.numbersAtLevel")}
              <HelpTip label={t("help.classProgression.title")}>
                {t("help.classProgression.body")}
              </HelpTip>
            </p>
            <LevelStats card={card} />
          </div>
        )}

        {card.features.length > 0 ? (
          <Stack gap="sm">
            {card.features.map((feature) => (
              <Accordion
                key={`${feature.name}-${feature.source}`}
                // Nested inside the level card's own bordered content area, so
                // the hairline would be a third border stacked on a second one.
                divider={false}
                contentClassName="bg-card/40"
                title={<FeatureSummary feature={feature} />}
              >
                <FeatureBody feature={feature} />
              </Accordion>
            ))}
          </Stack>
        ) : (
          <p className="text-xs italic text-muted-foreground">
            {hasProgression ? t("class.noFeatures") : t("class.nothingNewAtLevel")}
          </p>
        )}
      </Stack>
    </Accordion>
  );
}

export function ClassRenderer({ entity }: ClassRendererProps) {
  const { hitDice, primaryAbility, proficiency, spellcastingAbility } = entity;
  const { startingProficiencies, startingEquipment } = entity;

  const levelCards = buildLevelCards(entity);
  const hasLevelBreakdown = levelCards.some((card) => !card.empty);

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
        >
          <HelpTip label={t("help.hitDice.title")}>{t("help.hitDice.body")}</HelpTip>
        </EntityProperty>
        {primaryAbility.length > 0 && (
          <EntityProperty label={t("class.primaryAbility")} value={abilityList(primaryAbility)}>
            <HelpTip label={t("help.primaryAbility.title")}>
              {t("help.primaryAbility.body")}
            </HelpTip>
          </EntityProperty>
        )}
        {spellcastingAbility && (
          <EntityProperty
            label={t("class.spellcastingAbility")}
            value={abilityLabel(spellcastingAbility)}
          >
            <HelpTip label={t("help.spellcastingAbility.title")}>
              {t("help.spellcastingAbility.body")}
            </HelpTip>
          </EntityProperty>
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

      {hasLevelBreakdown && (
        <Section title={t("class.progression")} subtitle={t("class.progressionSubtitle")}>
          <Stack gap="sm">
            {levelCards.map((card) => (
              <LevelCard key={card.level} card={card} defaultOpen={card.level === 1} />
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
        <Section
          title={entity.subclassTitle ?? t("character.subclasses")}
          subtitle={t("class.subclassSubtitle")}
        >
          <ChipList values={entity.subclassGroups.map((g) => g.name)} tone="default" />
        </Section>
      )}
    </Stack>
  );
}
