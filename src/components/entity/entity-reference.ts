import { CATEGORY_REGISTRY, referenceToUrl, resolveEntity } from "@/compendium";
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
  const resolved = resolveEntity(canonicalId);
  if (!resolved) return null;
  const entity = resolved.selected;
  const category = entity.category;
  return {
    canonicalId,
    category,
    name: entity.name,
    source: entity.source,
    subtitle: CATEGORY_REGISTRY[category].getSubtitle(entity),
    href: referenceToUrl(canonicalId),
  };
}
