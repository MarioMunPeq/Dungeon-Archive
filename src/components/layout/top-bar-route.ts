import {
  CATEGORY_REGISTRY,
  canonicalIdFromSlug,
  categoryLabel,
  categoryLabelSingular,
  resolveEntity,
} from "@/compendium";
import type { EntityCategory } from "@/compendium";
import { APP_NAME, ROUTES } from "@/config/constants";

export interface TopBarState {
  readonly title: string;
  readonly backTo?: string;
  readonly hidden?: boolean;
}

const FIXED_TITLES: Record<string, string> = {
  [ROUTES.HOME]: APP_NAME,
  [ROUTES.RULES]: "Quick Rules",
  [ROUTES.COMBAT]: "Combat",
  [ROUTES.CHARACTER]: "Character",
  "/session": "Session",
  "/backup": "Backup",
};

const FIXED_BACK: Record<string, string> = {
  "/session": ROUTES.HOME,
  "/backup": ROUTES.HOME,
};

export function getTopBarState(pathname: string): TopBarState {
  if (pathname === ROUTES.SEARCH) {
    return { title: APP_NAME, hidden: true };
  }

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 1 && CATEGORY_REGISTRY[segments[0] as EntityCategory]) {
    return { title: categoryLabel(segments[0]!), backTo: ROUTES.SEARCH };
  }

  if (segments.length === 2 && CATEGORY_REGISTRY[segments[0] as EntityCategory]) {
    const category = segments[0] as EntityCategory;
    const canonicalId = canonicalIdFromSlug(category, segments[1]!);
    const resolved = resolveEntity(canonicalId);
    return {
      title: resolved?.selected.name ?? categoryLabelSingular(category),
      backTo: `/${category}`,
    };
  }

  if (pathname.startsWith("/debug/")) {
    return { title: "Debug", backTo: ROUTES.HOME };
  }

  return {
    title: FIXED_TITLES[pathname] ?? APP_NAME,
    backTo: FIXED_BACK[pathname],
  };
}
