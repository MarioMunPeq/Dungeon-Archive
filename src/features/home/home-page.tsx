import { Link } from "react-router-dom";
import { categoryLabelSingular } from "@/compendium";
import type { EntityCardData } from "@/compendium";
import { entityRefFromCanonicalId } from "@/components/entity";
import { Button } from "@/components/ui";
import {
  useActivePlayer,
  usePlayerReferences,
  useRecentEntities,
  useSessionIds,
} from "@/user-state";
import { CharacterCard } from "./character-card";
import { QuickTiles } from "./quick-tiles";
import { RecentEntityCard } from "./recent-entity-card";
import { SectionHeader } from "./section-header";

function entityCardFromCanonicalId(canonicalId: string): EntityCardData | null {
  const ref = entityRefFromCanonicalId(canonicalId);
  if (!ref) return null;
  return {
    name: ref.name,
    href: ref.href,
    category: ref.category,
    categoryLabel: categoryLabelSingular(ref.category),
    metadata: ref.subtitle,
    source: ref.source,
    canonicalId: ref.canonicalId,
    stat: ref.stat,
  };
}

export function HomePage() {
  const activePlayer = useActivePlayer();
  const sessionIds = useSessionIds(10);
  const recentIds = useRecentEntities(10);
  const players = usePlayerReferences();

  const sessionCards: EntityCardData[] = [];
  for (const id of sessionIds) {
    const card = entityCardFromCanonicalId(id);
    if (card) sessionCards.push(card);
  }

  const recentCards: EntityCardData[] = [];
  for (const id of recentIds) {
    const card = entityCardFromCanonicalId(id);
    if (card) recentCards.push(card);
  }

  const player = activePlayer ?? players[0] ?? null;

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <SectionHeader title="Current Character" to="/combat" />
        <CharacterCard player={player} />
      </section>

      <QuickTiles sessionCount={sessionCards.length} />

      <section className="flex flex-col gap-3">
        <SectionHeader title="Recently Viewed" chevron />
        {recentCards.length > 0 ? (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar snap-x snap-mandatory">
            {recentCards.map((card) => (
              <div key={card.href} className="w-32 shrink-0 snap-start">
                <RecentEntityCard
                  name={card.name}
                  href={card.href}
                  categoryLabel={card.categoryLabel}
                  metadata={card.metadata}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-border bg-surface p-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">Nothing viewed yet</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Browse the Compendium and return here to keep recent items within reach.
                </p>
              </div>
              <Link to="/search" className="w-fit">
                <Button size="sm">Browse the Compendium</Button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
