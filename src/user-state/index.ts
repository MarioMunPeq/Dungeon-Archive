/**
 * User State — lightweight persistent layer built on localStorage + Zustand.
 *
 * Bootstrap: call `hydrate()` immediately after `await loadCompendium()` in main.tsx,
 * before rendering the React tree.
 */

export {
  hydrate,
  userStore,
  useIsFavorite,
  useIsInSession,
  useIsInAdventure,
  useActiveAdventure,
  useActiveCharacter,
  usePrimaryCharacter,
  useAdventureEntityIds,
  useFavoriteIds,
  useSessionIds,
  useRecentEntities,
  useRecentSearches,
  useCharacters,
  useOnboardingComplete,
  useBeginnerMode,
  useTheme,
  useLanguage,
} from "./store";
export type { UserStore, CharacterReferenceUpdate } from "./store";
export type {
  UserState,
  Adventure,
  CharacterReference,
  AbilityScores,
  HitPoints,
  CombatValues,
  Theme,
  Language,
} from "./types";
export {
  STORAGE_KEY,
  CURRENT_VERSION,
  DEFAULT_THEME,
  THEMES,
  DEFAULT_LANGUAGE,
  LANGUAGES,
  isTheme,
  isLanguage,
  abilityModifier,
} from "./types";
export { normalize } from "./normalize";
export { toUserState } from "./serialization";
export { migrate } from "./migrations";
export { write } from "./persistence";
