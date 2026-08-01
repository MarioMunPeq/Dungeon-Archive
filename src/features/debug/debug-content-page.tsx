import { getSpell, getCondition } from "@/compendium";
import { ContentRenderer } from "@/components/content";

const entities = [
  { category: "spell" as const, id: "phb|fireball", label: "Fireball" },
  { category: "spell" as const, id: "phb|magic-missile", label: "Magic Missile" },
  { category: "spell" as const, id: "phb|wish", label: "Wish" },
  { category: "condition" as const, id: "phb|blinded", label: "Blinded" },
  { category: "condition" as const, id: "phb|exhaustion", label: "Exhaustion" },
];

function SpellSection({ id }: { id: string }) {
  const spell = getSpell(id);
  if (!spell) return <p className="text-sm text-muted-foreground">Not found</p>;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{spell.name}</h3>
        <p className="text-xs text-muted-foreground">
          Level {spell.level} · {spell.school} · {spell.castingTime} · {spell.range} ·{" "}
          {spell.duration}
          {spell.concentration ? " (concentration)" : ""}
          {spell.ritual ? " (ritual)" : ""}
        </p>
        <p className="text-xs text-muted-foreground">Components: {spell.components.join(", ")}</p>
        <p className="text-xs text-muted-foreground">Classes: {spell.classes.join(", ")}</p>
      </div>
      <div>
        <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Description</p>
        <ContentRenderer blocks={spell.description} />
      </div>
      {spell.higherLevels && spell.higherLevels.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
            At Higher Levels
          </p>
          <ContentRenderer blocks={spell.higherLevels} />
        </div>
      )}
    </div>
  );
}

function ConditionSection({ id }: { id: string }) {
  const condition = getCondition(id);
  if (!condition) return <p className="text-sm text-muted-foreground">Not found</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{condition.name}</h3>
      <div>
        <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Description</p>
        <ContentRenderer blocks={condition.description} />
      </div>
    </div>
  );
}

export function DebugContentPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-4">
      <h1 className="text-xl font-bold text-foreground">Debug: Content Rendering</h1>
      {entities.map((entity) => (
        <section
          key={entity.id}
          className="space-y-2 rounded-lg border border-border bg-surface p-4"
        >
          <p className="text-xs font-medium text-muted-foreground">
            {entity.category} · {entity.id}
          </p>
          {entity.category === "spell" ? (
            <SpellSection id={entity.id} />
          ) : (
            <ConditionSection id={entity.id} />
          )}
        </section>
      ))}
    </div>
  );
}
