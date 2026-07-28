import { getSpell } from "@/compendium";
import { EntityDetailLayout } from "@/components/entity";

const SCHOOL_MAP: Record<string, string> = {
  A: "Abjuration",
  C: "Conjuration",
  D: "Divination",
  E: "Enchantment",
  I: "Illusion",
  N: "Necromancy",
  T: "Transmutation",
  V: "Evocation",
};

export function DebugSpellPage() {
  const spell = getSpell("phb|fireball");
  if (!spell) return <p className="p-4 text-sm text-muted-foreground">Not found</p>;

  const tags: string[] = [];
  if (spell.ritual) tags.push("Ritual");
  if (spell.concentration) tags.push("Concentration");

  return (
    <EntityDetailLayout
      name={spell.name}
      subtitle={`Level ${spell.level} ${spell.level === 0 ? "Cantrip" : ""} · ${SCHOOL_MAP[spell.school] ?? spell.school}`}
      source={spell.source}
      metadata={[
        { label: "Casting Time", value: spell.castingTime },
        { label: "Range", value: spell.range },
        { label: "Components", value: spell.components.join(", ") },
        { label: "Duration", value: spell.duration },
        { label: "Classes", value: spell.classes.join(", ") },
        ...(tags.length > 0 ? [{ label: "Tags", value: tags.join(", ") }] : []),
      ]}
      description={spell.description}
      sections={
        spell.higherLevels && spell.higherLevels.length > 0
          ? [{ title: "At Higher Levels", blocks: spell.higherLevels }]
          : undefined
      }
    />
  );
}
