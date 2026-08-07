import { CATEGORY_REGISTRY, referenceToUrl, resolveEntity, entityCardStat } from "@/compendium";
import type { EntityCategory, CardStat } from "@/compendium";

export type BadgeVariant = "default" | "accent" | "outline" | "subtle";

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
 */
const entityRefCache = new Map<string, EntityRef>();

export function entityRefFromCanonicalId(canonicalId: string): EntityRef | null {
  const cached = entityRefCache.get(canonicalId);
  if (cached) return cached;
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
  entityRefCache.set(canonicalId, ref);
  return ref;
}
