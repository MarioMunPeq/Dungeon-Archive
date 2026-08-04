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
  useAdventureEntityIds,
  useFavoriteIds,
  useSessionIds,
  useRecentEntities,
  useRecentSearches,
  usePlayerReferences,
  useOnboardingComplete,
} from "./store";
export type { UserStore, PlayerReferenceUpdate } from "./store";
export type {
  UserState,
  Adventure,
  PlayerReference,
  AbilityModifiers,
  CombatValues,
} from "./types";
export { STORAGE_KEY, CURRENT_VERSION } from "./types";
export { normalize } from "./normalize";
export { toUserState } from "./serialization";
export { migrate } from "./migrations";
export { write } from "./persistence";
