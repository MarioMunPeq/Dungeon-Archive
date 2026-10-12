import { CATEGORY_REGISTRY, referenceToUrl, resolveEntity, entityCardStat } from "@/compendium";
import type { EntityCategory, CardStat } from "@/compendium";
import type { BadgeVariant } from "@/components/ui/Badge";

const BADGE_VARIANT: Record<string, BadgeVariant> = {
  spell: "default",
  monster: "accent",
  equipment: "outline",
  magicitem: "accent",
  feat: "subtle",
  condition: "outline",
  action: "subtle",
};

export function badgeVariantForCategory(category: EntityCategory): BadgeVariant {
  return BADGE_VARIANT[category] ?? "default";
}

export interface EntityRef {
  readonly canonicalId: string;
  readonly category: EntityCategory;
  readonly name: string;
  readonly source: string;
  readonly subtitle: string;
  readonly href: string;
  readonly stat?: CardStat;
}

/**
 * Compendium data is immutable and loaded once, so a resolved reference is
 * stable for the lifetime of the app. Caching avoids re-resolving on every
 * call (which walks category + version maps) and keeps object references
 * stable across renders, making memoized consumers effective.
 *
 * Bounded on purpose: without a cap the map grew with every entity the user
 * ever opened. Insertion order is the access order, so evicting the oldest key
 * is a cheap approximation of LRU — and the entities that get re-resolved are
 * the recently-viewed ones, which the next call re-resolves in a lookup.
 */
const MAX_CACHED_REFS = 600;

const entityRefCache = new Map<string, EntityRef>();

function cacheRef(canonicalId: string, ref: EntityRef): void {
  // Re-inserting moves the key to the end, refreshing its recency.
  entityRefCache.delete(canonicalId);
  entityRefCache.set(canonicalId, ref);
  if (entityRefCache.size <= MAX_CACHED_REFS) return;
  const oldest = entityRefCache.keys().next();
  if (oldest.done !== true) entityRefCache.delete(oldest.value);
}

export function entityRefFromCanonicalId(canonicalId: string): EntityRef | null {
  const cached = entityRefCache.get(canonicalId);
  if (cached) {
    cacheRef(canonicalId, cached);
    return cached;
  }
  const resolved = resolveEntity(canonicalId);
  if (!resolved) return null;
  const entity = resolved.selected;
  const category = entity.category;
  const ref: EntityRef = {
    canonicalId,
    category,
    name: entity.name,
    source: entity.source,
    subtitle: CATEGORY_REGISTRY[category].getSubtitle(entity),
    href: referenceToUrl(canonicalId),
    stat: entityCardStat(entity),
  };
  cacheRef(canonicalId, ref);
  return ref;
}
