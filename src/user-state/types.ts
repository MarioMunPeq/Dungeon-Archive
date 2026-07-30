/**
 * Only canonical IDs are stored, never full entity data.
 * The Compendium is the source of truth for entity resolution.
 */
export interface Adventure {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly objectives: string[];
  readonly notes: string;
  readonly entities: string[];
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly archived: boolean;
}

export interface UserState {
  readonly version: number;
  readonly favorites: string[];
  readonly recentEntities: string[];
  readonly recentSearches: string[];
  readonly session: string[];
  readonly adventures: Adventure[];
  readonly activeAdventureId: string | null;
}

export const STORAGE_KEY = "dungeon:userState:v1";
export const CURRENT_VERSION = 3;

export function createDefaultState(): UserState {
  return {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
  };
}
