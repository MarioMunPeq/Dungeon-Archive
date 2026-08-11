export const ROUTES = {
  HOME: "/",
  ARCHIVE: "/archive",
  COMBAT: "/combat",
  CHARACTER: "/character",
  DICE: "/dice",
  HELP: "/help",
} as const;

/** Routes retired in the navigation redesign, kept as redirects so old
 *  bookmarks and deep links still land in the right place. */
export const ROUTE_REDIRECTS: Readonly<Record<string, string>> = {
  "/search": ROUTES.ARCHIVE,
  "/rules": `${ROUTES.ARCHIVE}?tab=rules`,
};

export const APP_NAME = "Dungeon Archive";

/**
 * User-facing app version stored in cloud backup metadata. Keep in sync with
 * the version field in package.json.
 */
export const APP_VERSION = "0.1.0";
