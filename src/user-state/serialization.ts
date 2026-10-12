import type { UserState } from "./types";

/**
 * Projects the persisted subset of a store state onto a plain UserState.
 * Excludes derived fields (favoritesSet, sessionSet, _hasHydrated) and actions.
 * This is the single source of truth for which fields leave the local persistence
 * layer, and it feeds the cloud snapshot payload.
 */
export function toUserState(state: UserState): UserState {
  return {
    version: state.version,
    favorites: state.favorites,
    recentEntities: state.recentEntities,
    recentSearches: state.recentSearches,
    session: state.session,
    characters: state.characters,
    activeCharacterId: state.activeCharacterId,
    beginnerMode: state.beginnerMode,
    onboardingComplete: state.onboardingComplete,
    theme: state.theme,
    language: state.language,
  };
}
