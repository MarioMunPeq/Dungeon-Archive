import type { Adventure, UserState } from "./types";
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

export function normalize(state: Omit<UserState, "adventures" | "activeAdventureId"> & { adventures?: Adventure[]; activeAdventureId?: string | null }): UserState {
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
  };
}
