import type { AbilityModifiers, Adventure, CombatValues, PlayerReference, UserState } from "./types";
import { CURRENT_VERSION } from "./types";
import { isRegistered } from "../compendium/registry/entity-registry";

function uniqueStrings(arr: unknown, trim = false): string[] {
  if (!Array.isArray(arr)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of arr) {
    if (typeof item !== "string") continue;
    const val = trim ? item.trim() : item;
    if (!val) continue;
    if (seen.has(val)) continue;
    seen.add(val);
    result.push(val);
  }
  return result;
}

function normalizeFavorites(raw: unknown): string[] {
  return uniqueStrings(raw, true);
}

function normalizeRecentEntities(raw: unknown): string[] {
  const arr = uniqueStrings(raw, true);
  if (arr.length > 50) arr.length = 50;
  return arr;
}

function normalizeRecentSearches(raw: unknown): string[] {
  const arr = uniqueStrings(raw, true);
  if (arr.length > 20) arr.length = 20;
  return arr;
}

function normalizeSession(raw: unknown): string[] {
  const arr = uniqueStrings(raw, true);
  if (arr.length > 100) arr.length = 100;
  return arr;
}

export function validateIds(ids: string[]): string[] {
  return ids.filter((id) => isRegistered(id));
}

const MAX_ADVENTURES = 20;
const MAX_ENTITIES_PER_ADVENTURE = 100;
const MAX_OBJECTIVES_PER_ADVENTURE = 20;

function normalizeAdventure(raw: unknown): Adventure | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Record<string, unknown>;
  if (typeof a.id !== "string" || !a.id) return null;

  const objectives = uniqueStrings(a.objectives, true);
  if (objectives.length > MAX_OBJECTIVES_PER_ADVENTURE) objectives.length = MAX_OBJECTIVES_PER_ADVENTURE;

  const entities = validateIds(uniqueStrings(a.entities, true));
  if (entities.length > MAX_ENTITIES_PER_ADVENTURE) entities.length = MAX_ENTITIES_PER_ADVENTURE;

  return {
    id: a.id,
    title: typeof a.title === "string" ? a.title.trim() : "",
    description: typeof a.description === "string" ? a.description.trim() : "",
    objectives,
    notes: typeof a.notes === "string" ? a.notes.trim() : "",
    entities,
    createdAt: typeof a.createdAt === "number" ? a.createdAt : Date.now(),
    updatedAt: typeof a.updatedAt === "number" ? a.updatedAt : Date.now(),
    archived: typeof a.archived === "boolean" ? a.archived : false,
  };
}

function normalizeAdventures(raw: unknown): Adventure[] {
  if (!Array.isArray(raw)) return [];
  const valid: Adventure[] = [];
  for (const item of raw) {
    const adventure = normalizeAdventure(item);
    if (adventure) valid.push(adventure);
  }
  if (valid.length > MAX_ADVENTURES) valid.length = MAX_ADVENTURES;
  return valid;
}

const MAX_PLAYER_REFERENCES = 12;
const MAX_SPELL_IDS = 50;
const MAX_WEAPON_IDS = 10;
const MAX_MAGIC_ITEM_IDS = 30;
const MAX_NOTE_LENGTH = 280;

const MIN_MODIFIER = -5;
const MAX_MODIFIER = 10;
const MIN_COMBAT = 0;
const MAX_COMBAT = 40;
const MIN_INITIATIVE = -5;
const MAX_INITIATIVE = 20;

const DEFAULT_ABILITY_MODIFIERS: AbilityModifiers = {
  strength: 0,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  wisdom: 0,
  charisma: 0,
};

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(value)));
}

function clampOptInt(value: unknown, min: number, max: number): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return Math.max(min, Math.min(max, Math.floor(value)));
}

function normalizeAbilityModifiers(raw: unknown): AbilityModifiers {
  const mods = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    strength: clampInt(mods.strength, MIN_MODIFIER, MAX_MODIFIER, DEFAULT_ABILITY_MODIFIERS.strength),
    dexterity: clampInt(mods.dexterity, MIN_MODIFIER, MAX_MODIFIER, DEFAULT_ABILITY_MODIFIERS.dexterity),
    constitution: clampInt(mods.constitution, MIN_MODIFIER, MAX_MODIFIER, DEFAULT_ABILITY_MODIFIERS.constitution),
    intelligence: clampInt(mods.intelligence, MIN_MODIFIER, MAX_MODIFIER, DEFAULT_ABILITY_MODIFIERS.intelligence),
    wisdom: clampInt(mods.wisdom, MIN_MODIFIER, MAX_MODIFIER, DEFAULT_ABILITY_MODIFIERS.wisdom),
    charisma: clampInt(mods.charisma, MIN_MODIFIER, MAX_MODIFIER, DEFAULT_ABILITY_MODIFIERS.charisma),
  };
}

function normalizeCombatValues(raw: unknown): CombatValues {
  const values = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    armorClass: clampInt(values.armorClass, MIN_COMBAT, MAX_COMBAT, 10),
    initiativeModifier: clampInt(values.initiativeModifier, MIN_INITIATIVE, MAX_INITIATIVE, 0),
    passivePerception: clampInt(values.passivePerception, MIN_COMBAT, MAX_COMBAT, 10),
    spellSaveDc: clampOptInt(values.spellSaveDc, MIN_COMBAT, MAX_COMBAT),
    spellAttackBonus: clampOptInt(values.spellAttackBonus, MIN_INITIATIVE, MAX_INITIATIVE),
  };
}

function normalizePlayerReference(raw: unknown): PlayerReference | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  if (typeof p.id !== "string" || !p.id) return null;
  if (typeof p.name !== "string" || !p.name.trim()) return null;

  const knownSpellCanonicalIds = validateIds(uniqueStrings(p.knownSpellCanonicalIds, true));
  if (knownSpellCanonicalIds.length > MAX_SPELL_IDS) knownSpellCanonicalIds.length = MAX_SPELL_IDS;

  const weaponCanonicalIds = validateIds(uniqueStrings(p.weaponCanonicalIds, true));
  if (weaponCanonicalIds.length > MAX_WEAPON_IDS) weaponCanonicalIds.length = MAX_WEAPON_IDS;

  const magicItemCanonicalIds = validateIds(uniqueStrings(p.magicItemCanonicalIds, true));
  if (magicItemCanonicalIds.length > MAX_MAGIC_ITEM_IDS) magicItemCanonicalIds.length = MAX_MAGIC_ITEM_IDS;

  const note = typeof p.note === "string" ? p.note.trim() : "";

  return {
    id: p.id,
    name: p.name.trim(),
    class: typeof p.class === "string" ? p.class.trim() : "",
    level: clampInt(p.level, 1, 20, 1),
    subclass: typeof p.subclass === "string" ? p.subclass.trim() || undefined : undefined,
    abilityModifiers: normalizeAbilityModifiers(p.abilityModifiers),
    combatValues: normalizeCombatValues(p.combatValues),
    knownSpellCanonicalIds,
    weaponCanonicalIds,
    magicItemCanonicalIds,
    note: note.length > MAX_NOTE_LENGTH ? note.slice(0, MAX_NOTE_LENGTH) : note || undefined,
  };
}

function normalizePlayers(raw: unknown): PlayerReference[] {
  if (!Array.isArray(raw)) return [];
  const valid: PlayerReference[] = [];
  for (const item of raw) {
    const reference = normalizePlayerReference(item);
    if (reference) valid.push(reference);
  }
  if (valid.length > MAX_PLAYER_REFERENCES) valid.length = MAX_PLAYER_REFERENCES;
  return valid;
}

export function normalize(state: Omit<UserState, "adventures" | "activeAdventureId" | "players"> & { adventures?: Adventure[]; activeAdventureId?: string | null; players?: PlayerReference[] }): UserState {
  const adventures = normalizeAdventures(state.adventures ?? []);
  const activeAdventureId =
    state.activeAdventureId && adventures.some((a) => a.id === state.activeAdventureId)
      ? state.activeAdventureId
      : null;

  return {
    version: CURRENT_VERSION,
    favorites: normalizeFavorites(state.favorites),
    recentEntities: normalizeRecentEntities(state.recentEntities),
    recentSearches: normalizeRecentSearches(state.recentSearches),
    session: normalizeSession(state.session),
    adventures,
    activeAdventureId,
    players: normalizePlayers(state.players ?? []),
  };
}
