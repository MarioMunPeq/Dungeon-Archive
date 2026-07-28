import type { Spell } from "@/compendium";
import { MetadataGrid, Section } from "@/components/entity";
import { ContentRenderer } from "@/components/content";

const SCHOOL_NAMES: Record<string, string> = {
  A: "Abjuration",
  C: "Conjuration",
  D: "Divination",
  E: "Enchantment",
  I: "Illusion",
  N: "Necromancy",
  T: "Transmutation",
  V: "Evocation",
};

interface SpellRendererProps {
  readonly entity: Spell;
}

export function SpellRenderer({ entity }: SpellRendererProps) {
  const levelText = entity.level === 0 ? "Cantrip" : `Level ${entity.level}`;
  const schoolName = SCHOOL_NAMES[entity.school] ?? entity.school;

  const tags: { label: string; value: string }[] = [];
  if (entity.ritual) tags.push({ label: "Ritual", value: "Yes" });
  if (entity.concentration) tags.push({ label: "Concentration", value: "Yes" });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          {levelText} &middot; {schoolName}
        </p>
      </div>

      <MetadataGrid
        fields={[
          { label: "Casting Time", value: entity.castingTime },
          { label: "Range", value: entity.range },
          { label: "Components", value: entity.components.join(", ") },
          { label: "Duration", value: entity.duration },
          ...tags,
          { label: "Classes", value: entity.classes.join(", ") },
        ]}
      />

      <Section title="Description">
        <ContentRenderer blocks={entity.description} />
      </Section>

      {entity.higherLevels && entity.higherLevels.length > 0 && (
        <Section title="At Higher Levels">
          <ContentRenderer blocks={entity.higherLevels} />
        </Section>
      )}
    </div>
  );
}
