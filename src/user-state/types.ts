/**
 * Only canonical IDs are stored, never full entity data.
 * The Compendium is the source of truth for entity resolution.
 */
export interface PartyMember {
  readonly id: string;
  readonly name: string;
  readonly class: string;
  readonly level: number;
  readonly race?: string;
  readonly subclass?: string;
  readonly passivePerception?: number;
  readonly passiveInsight?: number;
  readonly passiveInvestigation?: number;
  readonly notes?: string;
  readonly knownSpellCanonicalIds: string[];
  readonly equippedArmorCanonicalId?: string;
  readonly equippedWeaponCanonicalIds: string[];
  readonly equippedMagicItemCanonicalIds: string[];
}

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
  readonly party: PartyMember[];
}

export const STORAGE_KEY = "dungeon:userState:v1";
export const CURRENT_VERSION = 4;

export function createDefaultState(): UserState {
  return {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    party: [],
  };
}
