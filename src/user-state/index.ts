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
  useActivePlayer,
  usePrimaryPlayer,
  useAdventureEntityIds,
  useFavoriteIds,
  useSessionIds,
  useRecentEntities,
  useRecentSearches,
  usePlayerReferences,
  useOnboardingComplete,
  useBeginnerMode,
  useTheme,
} from "./store";
export type { UserStore, PlayerReferenceUpdate } from "./store";
export type {
  UserState,
  Adventure,
  PlayerReference,
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
