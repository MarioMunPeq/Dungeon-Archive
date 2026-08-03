export const ROUTES = {
  HOME: "/",
  SEARCH: "/search",
  ADVENTURE: "/adventure",
  PARTY: "/party",
} as const;

export const APP_NAME = "Dungeon Archive";

/**
 * User-facing app version stored in cloud backup metadata. Keep in sync with
 * the version field in package.json.
 */
export const APP_VERSION = "0.1.0";

export const SEARCH_DEBOUNCE_MS = 150;
export const SEARCH_MAX_RESULTS = 20;

export const ANIMATION_DURATION_MS = 150;
