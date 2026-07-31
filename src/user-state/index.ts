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
  useAdventureEntityIds,
  useFavoriteIds,
  useSessionIds,
  useRecentEntities,
  useRecentSearches,
  usePartyMembers,
} from "./store";
export type { UserStore } from "./store";
export type { UserState, Adventure, AdventureScene, PartyMember } from "./types";
export { STORAGE_KEY, CURRENT_VERSION } from "./types";
export { normalize } from "./normalize";
