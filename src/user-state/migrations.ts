import type { Adventure, UserState } from "./types";
import { CURRENT_VERSION, createDefaultState } from "./types";

const migrations: Record<number, (state: Record<string, unknown>) => Record<string, unknown>> = {
  1: (raw) => ({
    version: 1,
    favorites: Array.isArray(raw.favorites) ? raw.favorites : [],
    recentEntities: Array.isArray(raw.recentEntities) ? raw.recentEntities : [],
    recentSearches: Array.isArray(raw.recentSearches) ? raw.recentSearches : [],
  }),
  2: (raw) => ({
    version: 2,
    favorites: Array.isArray(raw.favorites) ? raw.favorites : [],
    recentEntities: Array.isArray(raw.recentEntities) ? raw.recentEntities : [],
    recentSearches: Array.isArray(raw.recentSearches) ? raw.recentSearches : [],
    session: Array.isArray(raw.session) ? raw.session : [],
  }),
  3: (raw) => ({
    version: 3,
    favorites: Array.isArray(raw.favorites) ? raw.favorites : [],
    recentEntities: Array.isArray(raw.recentEntities) ? raw.recentEntities : [],
    recentSearches: Array.isArray(raw.recentSearches) ? raw.recentSearches : [],
    session: Array.isArray(raw.session) ? raw.session : [],
    adventures: Array.isArray(raw.adventures) ? raw.adventures : [],
    activeAdventureId: typeof raw.activeAdventureId === "string" ? raw.activeAdventureId : null,
  }),
};

export function migrate(raw: unknown): UserState {
  if (!raw || typeof raw !== "object") {
    return createDefaultState();
  }

  const obj = raw as Record<string, unknown>;
  const version = typeof obj.version === "number" ? obj.version : 0;

  let migrated = { ...obj } as Record<string, unknown>;

  if (version < 1) {
    migrated = migrations[1]!(migrated);
  }
  if (version < 2) {
    migrated = migrations[2]!(migrated);
  }
  if (version < 3) {
    migrated = migrations[3]!(migrated);
  }

  const result = migrated as unknown as Record<string, unknown>;
  if (
    !Array.isArray(result.favorites) ||
    !Array.isArray(result.recentEntities) ||
    !Array.isArray(result.recentSearches) ||
    !Array.isArray(result.session)
  ) {
    return createDefaultState();
  }

  return {
    version: CURRENT_VERSION,
    favorites: result.favorites as string[],
    recentEntities: result.recentEntities as string[],
    recentSearches: result.recentSearches as string[],
    session: result.session as string[],
    adventures: Array.isArray(result.adventures) ? (result.adventures as Adventure[]) : [],
    activeAdventureId: typeof result.activeAdventureId === "string" ? result.activeAdventureId : null,
  };
}
