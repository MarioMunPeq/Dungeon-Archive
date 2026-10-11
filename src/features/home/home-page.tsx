import { useMemo } from "react";
import { Link } from "react-router-dom";
import { categoryLabelSingular } from "@/compendium";
import type { EntityCardData } from "@/compendium";
import { entityRefFromCanonicalId } from "@/components/entity";
import { Button } from "@/components/ui";
import { t } from "@/i18n";
import { useLanguage, usePrimaryCharacter, useRecentEntities, useSessionIds } from "@/user-state";
import { CharacterCard } from "./character-card";
import { QuickTiles } from "./quick-tiles";
import { RecentEntityCard } from "./recent-entity-card";
import { SectionHeader } from "./section-header";

/**
 * Cards are derived from immutable compendium data, so they are cached per
 * canonical id. This keeps card references stable across renders (making the
 * memoized card components effective) and avoids re-resolving on every render.
 *
 * The category label and stat are localized, so the language is part of the
 * key: switching language must not serve cards built in the previous one.
 */
const cardCache = new Map<string, EntityCardData>();

function entityCardFromCanonicalId(canonicalId: string, language: string): EntityCardData | null {
  const key = `${language}:${canonicalId}`;
  const cached = cardCache.get(key);
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
  cardCache.set(key, card);
  return card;
}

export function HomePage() {
  const character = usePrimaryCharacter();
  const sessionIds = useSessionIds(10);
  const recentIds = useRecentEntities(10);
  const language = useLanguage();

  const sessionCards = useMemo(() => {
    const cards: EntityCardData[] = [];
    for (const id of sessionIds) {
      const card = entityCardFromCanonicalId(id, language);
      if (card) cards.push(card);
    }
    return cards;
  }, [sessionIds, language]);

  const recentCards = useMemo(() => {
    const cards: EntityCardData[] = [];
    for (const id of recentIds) {
      const card = entityCardFromCanonicalId(id, language);
      if (card) cards.push(card);
    }
    return cards;
  }, [recentIds, language]);

  // Normal top-down flow. `justify-between` + `min-h-full` was distributing the
  // leftover height into two ~150px voids and pushing the quick tiles past the
  // fold, which clipped their buttons; a page shorter than the viewport is fine.
  // Safe as a line comment: it sits inside the parentheses of `return (`, which
  // are JS, not in JSX children position.
  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <section className="flex flex-col gap-3">
        <SectionHeader title={t("home.currentCharacter")} to="/combat" />
        <CharacterCard character={character} />
      </section>

      <QuickTiles sessionCount={sessionCards.length} />

      <section className="flex flex-col gap-3">
        <SectionHeader title={t("home.recentlyViewed")} chevron />
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
                <p className="text-sm font-semibold text-foreground">{t("home.nothingViewed")}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {t("home.nothingViewedBody")}
                </p>
              </div>
              <Link to="/archive" className="w-fit">
                <Button size="sm">{t("home.browseCompendium")}</Button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
