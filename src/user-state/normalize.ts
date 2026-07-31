import type { Adventure, AdventureScene, PartyMember, UserState } from "./types";
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
const MAX_SCENES_PER_ADVENTURE = 30;
const MAX_REFERENCES_PER_SCENE = 60;

function normalizeScene(raw: unknown): AdventureScene | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  if (typeof s.id !== "string" || !s.id) return null;
  const title = typeof s.title === "string" ? s.title.trim() : "";
  if (!title) return null;

  const entities = validateIds(uniqueStrings(s.entities, true));
  if (entities.length > MAX_REFERENCES_PER_SCENE) entities.length = MAX_REFERENCES_PER_SCENE;

  return {
    id: s.id,
    title,
    description: typeof s.description === "string" ? s.description.trim() || undefined : undefined,
    note: typeof s.note === "string" ? s.note.trim() || undefined : undefined,
    entities,
  };
}

function normalizeScenes(raw: unknown): AdventureScene[] {
  if (!Array.isArray(raw)) return [];
  const valid: AdventureScene[] = [];
  for (const item of raw) {
    const scene = normalizeScene(item);
    if (scene) valid.push(scene);
  }
  if (valid.length > MAX_SCENES_PER_ADVENTURE) valid.length = MAX_SCENES_PER_ADVENTURE;
  return valid;
}

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
    scenes: normalizeScenes(a.scenes),
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

const MAX_PARTY_MEMBERS = 12;
const MAX_SPELL_IDS = 50;
const MAX_WEAPON_IDS = 10;
const MAX_MAGIC_ITEM_IDS = 30;

function normalizePartyMember(raw: unknown): PartyMember | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as Record<string, unknown>;
  if (typeof m.id !== "string" || !m.id) return null;
  if (typeof m.name !== "string" || !m.name.trim()) return null;

  const level = typeof m.level === "number" ? Math.max(1, Math.min(20, Math.floor(m.level))) : 1;

  const knownSpellCanonicalIds = validateIds(uniqueStrings(m.knownSpellCanonicalIds, true));
  if (knownSpellCanonicalIds.length > MAX_SPELL_IDS) knownSpellCanonicalIds.length = MAX_SPELL_IDS;

  const equippedWeaponCanonicalIds = validateIds(uniqueStrings(m.equippedWeaponCanonicalIds, true));
  if (equippedWeaponCanonicalIds.length > MAX_WEAPON_IDS) equippedWeaponCanonicalIds.length = MAX_WEAPON_IDS;

  const equippedMagicItemCanonicalIds = validateIds(uniqueStrings(m.equippedMagicItemCanonicalIds, true));
  if (equippedMagicItemCanonicalIds.length > MAX_MAGIC_ITEM_IDS) equippedMagicItemCanonicalIds.length = MAX_MAGIC_ITEM_IDS;

  const equippedArmorCanonicalId =
    typeof m.equippedArmorCanonicalId === "string" && isRegistered(m.equippedArmorCanonicalId)
      ? m.equippedArmorCanonicalId
      : undefined;

  return {
    id: m.id,
    name: m.name.trim(),
    class: typeof m.class === "string" ? m.class.trim() : "",
    level,
    race: typeof m.race === "string" ? m.race.trim() || undefined : undefined,
    subclass: typeof m.subclass === "string" ? m.subclass.trim() || undefined : undefined,
    passivePerception: typeof m.passivePerception === "number" ? m.passivePerception : undefined,
    passiveInsight: typeof m.passiveInsight === "number" ? m.passiveInsight : undefined,
    passiveInvestigation: typeof m.passiveInvestigation === "number" ? m.passiveInvestigation : undefined,
    notes: typeof m.notes === "string" ? m.notes.trim() || undefined : undefined,
    knownSpellCanonicalIds,
    equippedArmorCanonicalId,
    equippedWeaponCanonicalIds,
    equippedMagicItemCanonicalIds,
  };
}

function normalizeParty(raw: unknown): PartyMember[] {
  if (!Array.isArray(raw)) return [];
  const valid: PartyMember[] = [];
  for (const item of raw) {
    const member = normalizePartyMember(item);
    if (member) valid.push(member);
  }
  if (valid.length > MAX_PARTY_MEMBERS) valid.length = MAX_PARTY_MEMBERS;
  return valid;
}

export function normalize(state: Omit<UserState, "adventures" | "activeAdventureId" | "party"> & { adventures?: Adventure[]; activeAdventureId?: string | null; party?: PartyMember[] }): UserState {
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
    party: normalizeParty(state.party ?? []),
  };
}
