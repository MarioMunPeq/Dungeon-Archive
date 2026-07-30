import type { UserState } from "./types";
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

export function normalize(state: UserState): UserState {
  return {
    version: CURRENT_VERSION,
    favorites: normalizeFavorites(state.favorites),
    recentEntities: normalizeRecentEntities(state.recentEntities),
    recentSearches: normalizeRecentSearches(state.recentSearches),
    session: normalizeSession(state.session),
  };
}
