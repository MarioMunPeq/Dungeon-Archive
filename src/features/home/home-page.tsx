import { useMemo } from "react";
import { Link } from "react-router-dom";
import { categoryLabelSingular } from "@/compendium";
import type { EntityCardData } from "@/compendium";
import { entityRefFromCanonicalId } from "@/components/entity";
import { Button } from "@/components/ui";
import { usePrimaryPlayer, useRecentEntities, useSessionIds } from "@/user-state";
import { CharacterCard } from "./character-card";
import { QuickTiles } from "./quick-tiles";
import { RecentEntityCard } from "./recent-entity-card";
import { SectionHeader } from "./section-header";

/**
 * Cards are derived from immutable compendium data, so they are cached per
 * canonical id. This keeps card references stable across renders (making the
 * memoized card components effective) and avoids re-resolving on every render.
 */
const cardCache = new Map<string, EntityCardData>();

function entityCardFromCanonicalId(canonicalId: string): EntityCardData | null {
  const cached = cardCache.get(canonicalId);
  if (cached) return cached;
  const ref = entityRefFromCanonicalId(canonicalId);
  if (!ref) return null;
  const card: EntityCardData = {
    name: ref.name,
    href: ref.href,
    category: ref.category,
    categoryLabel: categoryLabelSingular(ref.category),
    metadata: ref.subtitle,
    source: ref.source,
    canonicalId: ref.canonicalId,
    stat: ref.stat,
  };
  cardCache.set(canonicalId, card);
  return card;
}

export function HomePage() {
  const player = usePrimaryPlayer();
  const sessionIds = useSessionIds(10);
  const recentIds = useRecentEntities(10);

  const sessionCards = useMemo(() => {
    const cards: EntityCardData[] = [];
    for (const id of sessionIds) {
      const card = entityCardFromCanonicalId(id);
      if (card) cards.push(card);
    }
    return cards;
  }, [sessionIds]);

  const recentCards = useMemo(() => {
    const cards: EntityCardData[] = [];
    for (const id of recentIds) {
      const card = entityCardFromCanonicalId(id);
      if (card) cards.push(card);
    }
    return cards;
  }, [recentIds]);

  return (
    <div className="flex min-h-full flex-col justify-between gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <SectionHeader title="Current Character" to="/combat" />
        <CharacterCard player={player} />
      </section>

      <QuickTiles sessionCount={sessionCards.length} />

      <section className="flex flex-col gap-3">
        <SectionHeader title="Recently Viewed" chevron />
        {recentCards.length > 0 ? (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar snap-x snap-mandatory scroll-pl-4">
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
