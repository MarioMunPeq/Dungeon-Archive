import { getSpell, getVersions, formatSource } from "@/compendium";
import { EntityDetailLayout } from "@/components/entity";
import { SpellRenderer } from "@/features/compendium/renderers/spell-renderer";

export function DebugSpellPage() {
  const spell = getSpell("phb|fireball");
  if (!spell) return <p className="p-4 text-sm text-muted-foreground">Not found</p>;

  const levelText = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
  const versions = getVersions(spell.canonicalId) ?? [];

  return (
    <EntityDetailLayout
      name={spell.name}
      subtitle={`${levelText} \u00B7 ${formatSource(spell.source)}`}
      source={spell.source}
      versions={versions}
      onSourceChange={() => {}}
    >
      <SpellRenderer entity={spell} />
    </EntityDetailLayout>
  );
}
