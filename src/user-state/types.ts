/**
 * Character Reference — a fast-consultation reference, not a full character
 * sheet. Only repeatedly-consulted combat values and references are stored.
 * Only canonical IDs are stored, never full entity data.
 * The Compendium is the source of truth for entity resolution.
 *
 * Ability scores are the source of truth; the modifier is always derived via
 * `abilityModifier(score)` = floor((score - 10) / 2).
 */
export interface AbilityScores {
  readonly strength: number;
  readonly dexterity: number;
  readonly constitution: number;
  readonly intelligence: number;
  readonly wisdom: number;
  readonly charisma: number;
}

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export interface HitPoints {
  readonly current: number;
  readonly max: number;
}

export interface CombatValues {
  readonly armorClass: number;
  readonly initiativeModifier: number;
  readonly passivePerception: number;
  readonly spellSaveDc?: number;
  readonly spellAttackBonus?: number;
}

export interface CharacterReference {
  readonly id: string;
  readonly name: string;
  readonly class: string;
  readonly level: number;
  readonly subclass?: string;
  readonly abilityScores: AbilityScores;
  readonly hitPoints: HitPoints;
  readonly combatValues: CombatValues;
  readonly knownSpellCanonicalIds: string[];
  readonly weaponCanonicalIds: string[];
  readonly magicItemCanonicalIds: string[];
  readonly activeConditions: string[];
  readonly note?: string;
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

export type Theme = "jade" | "amber" | "teal" | "gold" | "wine" | "plum" | "steel";

export interface UserState {
  readonly version: number;
  readonly favorites: string[];
  readonly recentEntities: string[];
  readonly recentSearches: string[];
  readonly session: string[];
  readonly adventures: Adventure[];
  readonly activeAdventureId: string | null;
  readonly characters: CharacterReference[];
  readonly activeCharacterId: string | null;
  readonly beginnerMode: boolean;
  readonly onboardingComplete: boolean;
  readonly theme: Theme;
}

export const STORAGE_KEY = "dungeon:userState:v1";
export const CURRENT_VERSION = 13;
export const DEFAULT_THEME: Theme = "teal";
export const THEMES: readonly Theme[] = ["jade", "amber", "teal", "gold", "wine", "plum", "steel"];

export function isTheme(value: unknown): value is Theme {
  return (
    value === "jade" ||
    value === "amber" ||
    value === "teal" ||
    value === "gold" ||
    value === "wine" ||
    value === "plum" ||
    value === "steel"
  );
}

export function createDefaultState(): UserState {
  return {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: DEFAULT_THEME,
  };
}
