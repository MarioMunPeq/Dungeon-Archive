import { CATEGORY_REGISTRY, getEntity, slugFromCanonicalId } from "@/compendium";
import type { EntityCategory } from "@/compendium";

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
}

export function entityRefFromCanonicalId(canonicalId: string): EntityRef | null {
  const dot = canonicalId.indexOf(".");
  if (dot === -1) return null;
  const category = canonicalId.substring(0, dot) as EntityCategory;
  const entityId = canonicalId.substring(dot + 1);
  const entity = getEntity(category, entityId);
  if (!entity) return null;
  return {
    canonicalId,
    category,
    name: entity.name,
    source: entity.source,
    subtitle: CATEGORY_REGISTRY[category].getSubtitle(entity),
    href: `/${category}/${slugFromCanonicalId(canonicalId)}`,
  };
}
