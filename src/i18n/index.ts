/**
 * Localization — a typed message dictionary plus `t()`, with no runtime
 * dependency. The active language lives in the user-state store (see the
 * `language` field, persisted and synced like the accent theme), and the
 * Compendium's own SRD data stays in English by design.
 */
export { t, translate, translateFor } from "./translate";
export type { Translate, TranslationKey, TranslationVars } from "./translate";
export { en } from "./messages/en";
export { es } from "./messages/es";
export { DEFAULT_LANGUAGE, LANGUAGES, isLanguage } from "@/user-state";
export type { Language } from "@/user-state";
