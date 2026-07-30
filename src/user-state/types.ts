/**
 * Only canonical IDs are stored, never full entity data.
 * The Compendium is the source of truth for entity resolution.
 */
export interface UserState {
  readonly version: number;
  readonly favorites: string[];
  readonly recentEntities: string[];
  readonly recentSearches: string[];
}

export const STORAGE_KEY = "dungeon:userState:v1";
export const CURRENT_VERSION = 1;

export function createDefaultState(): UserState {
  return {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
  };
}
