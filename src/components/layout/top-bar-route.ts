import {
  CATEGORY_REGISTRY,
  canonicalIdFromSlug,
  categoryLabel,
  categoryLabelSingular,
  resolveEntity,
} from "@/compendium";
import type { EntityCategory } from "@/compendium";
import { APP_NAME, ROUTES } from "@/config/constants";
import type { Translate, TranslationKey } from "@/i18n";

export interface TopBarState {
  readonly title: string;
  readonly backTo?: string;
}

const FIXED_TITLES: Record<string, TranslationKey> = {
  [ROUTES.ARCHIVE]: "page.archive",
  [ROUTES.COMBAT]: "page.combat",
  [ROUTES.CHARACTER]: "page.character",
  [ROUTES.DICE]: "page.dice",
  [ROUTES.HELP]: "page.help",
  "/session": "page.session",
  "/backup": "page.backup",
};

const FIXED_BACK: Record<string, string> = {
  "/session": ROUTES.HOME,
  "/backup": ROUTES.HOME,
  [ROUTES.HELP]: ROUTES.HOME,
};

/**
 * `t` is injected rather than read from the store so this stays a pure function
 * and both languages stay assertable from tests.
 *
 * The home route returns an empty title: the bottom nav already shows "Home", and
 * the app name was truncating the row that entity names need.
 */
export function getTopBarState(pathname: string, t: Translate): TopBarState {
  const segments = pathname.split("/").filter(Boolean);

  if (pathname === ROUTES.HOME) {
    return { title: "" };
  }

  if (segments.length === 1 && CATEGORY_REGISTRY[segments[0] as EntityCategory]) {
    return { title: categoryLabel(segments[0]!), backTo: ROUTES.ARCHIVE };
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
    return { title: t("page.debug"), backTo: ROUTES.HOME };
  }

  const fixed = FIXED_TITLES[pathname];
  return {
    title: fixed ? t(fixed) : APP_NAME,
    backTo: FIXED_BACK[pathname],
  };
}
