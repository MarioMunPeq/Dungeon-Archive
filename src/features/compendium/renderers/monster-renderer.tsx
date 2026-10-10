import type { ReactNode } from "react";
import type { Monster } from "@/compendium";
import { AbilityScores } from "@/components/ui/ability-scores";
import type { AbilityKey } from "@/components/ui/ability-scores";
import { Stack } from "@/components/ui/Stack";
import { Section } from "@/components/ui/Section";
import { EntityProperty, EntityMetadataGrid } from "@/components/ui/entity-property";
import { HelpTip } from "@/components/ui/HelpTip";
import { ContentRenderer } from "@/components/content/content-renderer";
import { t } from "@/i18n";

interface MonsterRendererProps {
  readonly entity: Monster;
}

interface StatHelp {
  readonly title: string;
  readonly text: string;
}

function StatCard({ label, value, help }: { label: string; value: ReactNode; help?: StatHelp }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1 rounded-stat border border-border bg-card px-2 py-3">
      <span className="flex w-full items-center justify-between gap-0.5">
        <span className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">
          {label}
        </span>
        {help && <HelpTip label={help.title}>{help.text}</HelpTip>}
      </span>
      <span className="font-mono text-2xl font-bold tabular-nums leading-none text-foreground">
        {value}
      </span>
    </div>
  );
}

function SpeedValue({ value }: { value: string }) {
  const segments = value.split(", ").filter(Boolean);
  return (
    <span className="flex flex-wrap justify-center gap-x-1">
      {segments.map((segment, index) => (
        <span key={index} className="max-w-full break-words">
          {segment.replace(/ /g, "\u00A0")}
        </span>
      ))}
    </span>
  );
}

export function MonsterRenderer({ entity }: MonsterRendererProps) {
  const abilities: Record<AbilityKey, number> = {
    strength: entity.abilities.str,
    dexterity: entity.abilities.dex,
    constitution: entity.abilities.con,
    intelligence: entity.abilities.int,
    wisdom: entity.abilities.wis,
    charisma: entity.abilities.cha,
  };

  return (
    <Stack gap="md">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard
          label={t("character.armorClass")}
          value={entity.armorClass}
          help={{
            title: "What is Armor Class?",
            text: "Armor Class is what attackers must beat to hit this creature.",
          }}
        />
        <StatCard
          label={t("combat.hitPoints")}
          value={entity.hitPoints}
          help={{
            title: "What are Hit Points?",
            text: "Hit Points measure how much damage the creature can take before dropping.",
          }}
        />
        <StatCard label={t("monster.speed")} value={<SpeedValue value={entity.speed} />} />
        <StatCard
          label={t("term.cr")}
          value={entity.challengeRating}
          help={{
            title: "What is Challenge Rating?",
            text: "A rough estimate of danger. CR 3 suits a group of four 3rd-level adventurers.",
          }}
        />
      </div>
      <EntityMetadataGrid>
        <EntityProperty label={t("filter.size")} value={`${entity.size} ${entity.monsterType}`} />
        <EntityProperty label={t("monster.alignment")} value={entity.alignment.join(" ")} />
      </EntityMetadataGrid>

      <Section title={t("character.abilities")}>
        <AbilityScores scores={abilities} />
      </Section>

      {entity.traits.length > 0 && (
        <Section title={t("monster.traits")}>
          <ContentRenderer blocks={entity.traits} />
        </Section>
      )}

      {entity.actions.length > 0 && (
        <Section title={t("monster.actions")}>
          <ContentRenderer blocks={entity.actions} />
        </Section>
      )}

      {entity.reactions.length > 0 && (
        <Section title={t("monster.reactions")}>
          <ContentRenderer blocks={entity.reactions} />
        </Section>
      )}

      {entity.legendaryActions.length > 0 && (
        <Section title={t("monster.legendaryActions")}>
          <ContentRenderer blocks={entity.legendaryActions} />
        </Section>
      )}

      {entity.description.length > 0 && (
        <Section title={t("common.description")}>
          <ContentRenderer blocks={entity.description} />
        </Section>
      )}
    </Stack>
  );
}
