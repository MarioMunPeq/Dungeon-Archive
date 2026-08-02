import type { UserState } from "./types";

/**
 * Projects the persisted subset of a store state onto a plain UserState.
 * Excludes derived fields (favoritesSet, sessionSet, adventureEntitySet,
 * _hasHydrated) and actions. This is the single source of truth for which
 * fields leave the local persistence layer.
 */
export function toUserState(state: UserState): UserState {
  return {
    version: state.version,
    favorites: state.favorites,
    recentEntities: state.recentEntities,
    recentSearches: state.recentSearches,
    session: state.session,
    adventures: state.adventures,
    activeAdventureId: state.activeAdventureId,
    players: state.players,
    onboardingComplete: state.onboardingComplete,
  };
}
