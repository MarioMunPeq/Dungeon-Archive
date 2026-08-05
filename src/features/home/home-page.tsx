import { Link } from "react-router-dom";
import { categoryLabel, categoryLabelSingular, CATEGORY_REGISTRY, METADATA_SEPARATOR } from "@/compendium";
import type { EntityCategory, EntityCardData } from "@/compendium";
import {
  useFavoriteIds,
  useRecentEntities,
  useSessionIds,
  useActiveAdventure,
  useActivePlayer,
  usePlayerReferences,
} from "@/user-state";
import { entityRefFromCanonicalId, EntityCard } from "@/components/entity";
import { isFirebaseConfigured } from "@/lib/firebase/config";

const CATEGORIES = Object.keys(CATEGORY_REGISTRY) as EntityCategory[];

function entityCardFromCanonicalId(canonicalId: string): EntityCardData | null {
  const ref = entityRefFromCanonicalId(canonicalId);
  if (!ref) return null;
  return {
    name: ref.name,
    href: ref.href,
    categoryLabel: categoryLabelSingular(ref.category),
    metadata: ref.subtitle,
    source: ref.source,
    canonicalId: ref.canonicalId,
  };
}

function SectionHeader({ title, to }: { title: string; to?: string }) {
  const content = (
    <span className="flex items-center gap-1">
      {title}
      {to && (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-3 w-3"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </span>
  );
  return to ? (
    <Link
      to={to}
      className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
    >
      {content}
    </Link>
  ) : (
    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {content}
    </h2>
  );
}

export function HomePage() {
  const adventure = useActiveAdventure();
  const activePlayer = useActivePlayer();
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

  const favoriteIds = useFavoriteIds(10);
  const favoriteCards: EntityCardData[] = [];
  for (const id of favoriteIds) {
    const card = entityCardFromCanonicalId(id);
    if (card) favoriteCards.push(card);
  }

  const players = usePlayerReferences();
  const shownPlayers = players.slice(0, 5);

  const hasContent = sessionCards.length > 0 || recentCards.length > 0 || favoriteCards.length > 0;
  const emptyWorkspace = players.length === 0 && !adventure && !hasContent;

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      {emptyWorkspace ? (
        <section className="flex flex-col items-center gap-4 px-2 py-10 text-center">
          <h2 className="text-2xl font-bold text-foreground">Welcome to your workspace</h2>
          <p className="w-full max-w-md text-sm text-muted-foreground">
            Search the Compendium and pin the spells, monsters, and items you need. Your party,
            adventure, and session build up here.
          </p>
          <Link
            to="/search"
            className="inline-flex touch-target items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary-hover active:scale-95 active:bg-primary-active"
          >
            Search the Compendium
          </Link>
        </section>
      ) : (
        <>
          {players.length > 0 && (
            <section className="flex flex-col gap-3">
              <SectionHeader title="Current Character" to="/party" />
              {activePlayer ? (
                <Link
                  to="/party"
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:bg-accent active:bg-accent/80"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {activePlayer.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {activePlayer.class ? `${activePlayer.class} ${METADATA_SEPARATOR} ` : ""}Lv{" "}
                      {activePlayer.level}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-foreground-subtle">
                    Current
                  </span>
                </Link>
              ) : (
                <Link
                  to="/party"
                  className="rounded-lg border border-dashed border-border px-4 py-3 text-xs text-muted-foreground transition-colors hover:bg-accent active:bg-accent/80"
                >
                  Choose a current character
                </Link>
              )}
            </section>
          )}

          {players.length > 0 ? (
            <section className="flex flex-col gap-3">
              <SectionHeader title="Party" to="/party" />
              <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface px-4 py-2">
                {shownPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between gap-2 py-2">
                    <span className="flex min-w-0 items-center gap-2 truncate text-sm font-semibold text-foreground">
                      <span className="truncate">{player.name}</span>
                      {player.id === activePlayer?.id && (
                        <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Current
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {player.class ? `${player.class} ${METADATA_SEPARATOR} ` : ""}Lv {player.level}
                    </span>
                  </div>
                ))}
                {players.length > shownPlayers.length && (
                  <p className="pb-1 text-xs text-foreground-subtle">
                    +{players.length - shownPlayers.length} more
                  </p>
                )}
              </div>
            </section>
          ) : (
            <Link
              to="/party"
              className="flex items-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground transition-colors hover:bg-accent active:bg-accent/80"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Add Player</span>
            </Link>
          )}

          {adventure ? (
            <section className="flex flex-col gap-3">
              <SectionHeader title="Current Adventure" to="/adventure" />
              <Link
                to="/adventure"
                className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-accent active:bg-accent/80"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{adventure.title}</span>
                  {adventure.archived && (
                    <span className="text-xs text-foreground-subtle">Archived</span>
                  )}
                </div>
                {adventure.description && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {adventure.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-foreground-subtle">
                  <span>
                    {adventure.entities.length} reference
                    {adventure.entities.length === 1 ? "" : "s"}
                  </span>
                  <span>
                    {adventure.objectives.length} objective
                    {adventure.objectives.length === 1 ? "" : "s"}
                  </span>
                </div>
              </Link>
            </section>
          ) : (
            <Link
              to="/adventure"
              className="flex items-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground transition-colors hover:bg-accent active:bg-accent/80"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
              >
                <line x1="4" y1="3" x2="4" y2="21" />
                <polyline points="4 3 20 3 18 7 20 11 4 11" />
              </svg>
              <span>Create Adventure</span>
            </Link>
          )}

          <section className="flex flex-col gap-3">
            <SectionHeader title="Session" to="/session" />
            {sessionCards.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {sessionCards.map((card) => (
                  <EntityCard key={card.href} {...card} />
                ))}
              </div>
            ) : (
              <Link
                to="/search"
                className="rounded-lg border border-dashed border-border px-4 py-3 text-xs text-muted-foreground transition-colors hover:bg-accent active:bg-accent/80"
              >
                Nothing pinned yet. Search the Compendium and pin what you need.
              </Link>
            )}
          </section>
        </>
      )}

      {recentCards.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeader title="Recently Viewed" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {recentCards.map((card) => (
              <EntityCard key={card.href} {...card} />
            ))}
          </div>
        </section>
      )}

      {favoriteCards.length > 0 && (
        <section className="flex flex-col gap-3">
          <SectionHeader title="Favorites" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteCards.map((card) => (
              <EntityCard key={card.href} {...card} />
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Compendium
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/${cat}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-3 transition-colors hover:bg-accent active:bg-accent/80"
            >
              <span className="text-sm font-medium text-foreground">{categoryLabel(cat)}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4 shrink-0 text-muted-foreground"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {isFirebaseConfigured() && (
        <div className="flex justify-center pt-2">
          <Link
            to="/backup"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent/80"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path d="M17.5 19a4.5 4.5 0 1 0-.42-8.98 6 6 0 1 0-11.66 1.48A3.5 3.5 0 0 0 7 19h10.5Z" />
            </svg>
            Cloud Backup
          </Link>
        </div>
      )}
    </div>
  );
}
