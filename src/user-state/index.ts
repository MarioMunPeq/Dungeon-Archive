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
} from "./types";
export {
  STORAGE_KEY,
  CURRENT_VERSION,
  DEFAULT_THEME,
  THEMES,
  isTheme,
  abilityModifier,
} from "./types";
export { normalize } from "./normalize";
export { toUserState } from "./serialization";
export { migrate } from "./migrations";
export { write } from "./persistence";
