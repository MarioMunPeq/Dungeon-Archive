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

export type Theme = "jade" | "amber" | "teal" | "gold" | "wine" | "plum" | "steel";

/**
 * UI languages. The Compendium data itself stays in the English of the SRD:
 * only application chrome and taxonomy labels are translated.
 */
export type Language = "en" | "es";

export interface UserState {
  readonly version: number;
  readonly favorites: string[];
  readonly recentEntities: string[];
  readonly recentSearches: string[];
  readonly session: string[];
  readonly characters: CharacterReference[];
  readonly activeCharacterId: string | null;
  readonly beginnerMode: boolean;
  readonly onboardingComplete: boolean;
  readonly theme: Theme;
  readonly language: Language;
}

export const STORAGE_KEY = "dungeon:userState:v1";
/**
 * v15 dropped the multi-campaign "adventures" model (replaced by the single
 * session, ADR-004). Migration 15 strips the fields; older migrations above are
 * left intact because they still have to read pre-v15 payloads.
 */
export const CURRENT_VERSION = 15;
export const DEFAULT_THEME: Theme = "teal";
export const THEMES: readonly Theme[] = ["jade", "amber", "teal", "gold", "wine", "plum", "steel"];
export const DEFAULT_LANGUAGE: Language = "en";
export const LANGUAGES: readonly Language[] = ["en", "es"];

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

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "es";
}

export function createDefaultState(): UserState {
  return {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: DEFAULT_THEME,
    language: DEFAULT_LANGUAGE,
  };
}
