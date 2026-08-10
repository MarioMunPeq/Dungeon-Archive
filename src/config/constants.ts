export const ROUTES = {
  HOME: "/",
  SEARCH: "/search",
  RULES: "/rules",
  COMBAT: "/combat",
  CHARACTER: "/character",
  DICE: "/dice",
  HELP: "/help",
} as const;

export const APP_NAME = "Dungeon Archive";

/**
 * User-facing app version stored in cloud backup metadata. Keep in sync with
 * the version field in package.json.
 */
export const APP_VERSION = "0.1.0";
