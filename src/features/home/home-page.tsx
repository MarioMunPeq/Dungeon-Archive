import { Link } from "react-router";
import {
  categoryLabel,
  getCategoryCount,
  CATEGORY_REGISTRY,
  getEntity,
  slugFromCanonicalId,
} from "@/compendium";
import type { EntityCategory } from "@/compendium";
import { useRecentEntities, useSessionIds, userStore } from "@/user-state";
import { EntityCard } from "@/features/compendium/components/entity-card";
import type { EntityCardData } from "@/features/compendium/components/entity-card";

const CATEGORIES = Object.keys(CATEGORY_REGISTRY) as EntityCategory[];

function entityCardFromCanonicalId(canonicalId: string): EntityCardData | null {
  const dot = canonicalId.indexOf(".");
  if (dot === -1) return null;
  const category = canonicalId.substring(0, dot) as EntityCategory;
  const id = canonicalId.substring(dot + 1);
  const entity = getEntity(category, id);
  if (!entity) return null;
  const reg = CATEGORY_REGISTRY[category];
  return {
    name: entity.name,
    href: `/${category}/${slugFromCanonicalId(canonicalId)}`,
    categoryLabel: reg.singular,
    metadata: reg.getSubtitle(entity),
    source: entity.source,
    canonicalId,
  };
}

export function HomePage() {
  const sessionIds = useSessionIds(10);
  const recentIds = useRecentEntities(10);

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

  const favoriteIds = userStore((s) => s.favorites.slice(0, 10));
  const favoriteCards: EntityCardData[] = [];
  for (const id of favoriteIds) {
    const card = entityCardFromCanonicalId(id);
    if (card) favoriteCards.push(card);
  }

  return (
    <div className="flex flex-col gap-8 px-4 py-8">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Dungeon Archive</h1>
        <p className="text-sm text-muted-foreground">Your tabletop companion</p>
      </div>

      {sessionCards.length > 0 && (
        <div className="flex flex-col gap-3">
          <Link
            to="/session"
            className="flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary"
          >
            Continue Session
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
            {sessionCards.map((card) => (
              <div key={card.href} className="w-56 shrink-0">
                <EntityCard {...card} />
              </div>
            ))}
          </div>
        </div>
      )}

      {recentCards.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">Continue Reading</h2>
          {recentCards.length <= 3 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {recentCards.map((card) => (
                <EntityCard key={card.href} {...card} />
              ))}
            </div>
          ) : (
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
              {recentCards.map((card) => (
                <div key={card.href} className="w-56 shrink-0">
                  <EntityCard {...card} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {favoriteCards.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">Favorites</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteCards.map((card) => (
              <EntityCard key={card.href} {...card} />
            ))}
          </div>
        </div>
      )}

      {sessionCards.length === 0 && recentCards.length === 0 && favoriteCards.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Browse entities, search for something, or tap the heart and pin icons to save favorites and build your session.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            to={`/${cat}`}
            className="flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:bg-accent active:bg-accent/80"
          >
            <span className="text-base font-semibold text-foreground">{categoryLabel(cat)}</span>
            <span className="text-sm text-muted-foreground">{getCategoryCount(cat)} entries</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          to="/search"
          className="rounded-lg border border-border p-4 text-center transition-colors hover:bg-accent active:bg-accent/80"
        >
          <span className="text-sm font-medium text-foreground">Search</span>
        </Link>
        <Link
          to="/adventure"
          className="rounded-lg border border-border p-4 text-center transition-colors hover:bg-accent active:bg-accent/80"
        >
          <span className="text-sm font-medium text-foreground">Adventure</span>
        </Link>
      </div>
    </div>
  );
}
