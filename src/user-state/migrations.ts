import type { UserState } from "./types";
import { CURRENT_VERSION, createDefaultState } from "./types";

const migrations: Record<number, (state: Record<string, unknown>) => Record<string, unknown>> = {
  1: (raw) => ({
    version: 1,
    favorites: Array.isArray(raw.favorites) ? raw.favorites : [],
    recentEntities: Array.isArray(raw.recentEntities) ? raw.recentEntities : [],
    recentSearches: Array.isArray(raw.recentSearches) ? raw.recentSearches : [],
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

  const result = migrated as unknown as UserState;
  if (
    !Array.isArray(result.favorites) ||
    !Array.isArray(result.recentEntities) ||
    !Array.isArray(result.recentSearches)
  ) {
    return createDefaultState();
  }

  return {
    version: CURRENT_VERSION,
    favorites: result.favorites,
    recentEntities: result.recentEntities,
    recentSearches: result.recentSearches,
  };
}
