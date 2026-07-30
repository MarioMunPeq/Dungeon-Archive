import { create } from "zustand";
import type { UserState } from "./types";
import { STORAGE_KEY, CURRENT_VERSION } from "./types";
import { read, write } from "./persistence";
import { migrate } from "./migrations";
import { normalize, validateIds } from "./normalize";

interface UserActions {
  toggleFavorite: (canonicalId: string) => void;
  addRecentEntity: (canonicalId: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  clearRecentEntities: () => void;
  toggleSession: (canonicalId: string) => void;
  clearSession: () => void;
  _replace: (state: UserState) => void;
  _reset: () => void;
}

export type UserStore = UserState & UserActions & {
  favoritesSet: Set<string>;
  sessionSet: Set<string>;
  _hasHydrated: boolean;
};

function moveToFront<T>(arr: T[], item: T, max: number): T[] {
  const filtered = arr.filter((x) => x !== item);
  filtered.unshift(item);
  if (filtered.length > max) filtered.length = max;
  return filtered;
}

function toggleItem(arr: string[], item: string): string[] {
  const idx = arr.indexOf(item);
  if (idx !== -1) {
    const copy = [...arr];
    copy.splice(idx, 1);
    return copy;
  }
  return [...arr, item];
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePersist(getState: () => UserStore): void {
  if (debounceTimer !== null) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    const { version, favorites, recentEntities, recentSearches, session } = getState();
    write({ version, favorites, recentEntities, recentSearches, session });
  }, 150);
}

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export const userStore = create<UserStore>((set, get) => ({
  version: CURRENT_VERSION,
  favorites: [],
  favoritesSet: new Set<string>(),
  recentEntities: [],
  recentSearches: [],
  session: [],
  sessionSet: new Set<string>(),
  _hasHydrated: false,

  toggleFavorite: (canonicalId) => {
    set((s) => {
      const favorites = toggleItem(s.favorites, canonicalId);
      return { favorites, favoritesSet: new Set(favorites) };
    });
    schedulePersist(get);
  },

  addRecentEntity: (canonicalId) => {
    set((s) => ({ recentEntities: moveToFront(s.recentEntities, canonicalId, 50) }));
    schedulePersist(get);
  },

  addRecentSearch: (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    set((s) => ({ recentSearches: moveToFront(s.recentSearches, trimmed, 20) }));
    schedulePersist(get);
  },

  clearRecentSearches: () => {
    set({ recentSearches: [] });
    schedulePersist(get);
  },

  clearRecentEntities: () => {
    set({ recentEntities: [] });
    schedulePersist(get);
  },

  toggleSession: (canonicalId) => {
    set((s) => {
      const idx = s.session.indexOf(canonicalId);
      if (idx !== -1) {
        const copy = [...s.session];
        copy.splice(idx, 1);
        return { session: copy, sessionSet: new Set(copy) };
      }
      const updated = [canonicalId, ...s.session];
      return { session: updated, sessionSet: new Set(updated) };
    });
    schedulePersist(get);
  },

  clearSession: () => {
    set({ session: [], sessionSet: new Set<string>() });
    schedulePersist(get);
  },

  _replace: (state) => {
    set({
      version: state.version,
      favorites: state.favorites,
      favoritesSet: new Set(state.favorites),
      recentEntities: state.recentEntities,
      recentSearches: state.recentSearches,
      session: state.session,
      sessionSet: new Set(state.session),
    });
  },

  _reset: () => {
    set({
      version: CURRENT_VERSION,
      favorites: [],
      favoritesSet: new Set<string>(),
      recentEntities: [],
      recentSearches: [],
      session: [],
      sessionSet: new Set<string>(),
      _hasHydrated: false,
    });
  },
}));

export function useIsFavorite(canonicalId: string): boolean {
  return userStore((s) => s.favoritesSet.has(canonicalId));
}

export function useIsInSession(canonicalId: string): boolean {
  return userStore((s) => s.sessionSet.has(canonicalId));
}

export function useSessionIds(limit?: number): string[] {
  return userStore((s) => (limit !== undefined ? s.session.slice(0, limit) : s.session));
}

export function useRecentEntities(limit = 10): string[] {
  return userStore((s) => s.recentEntities.slice(0, limit));
}

export function useRecentSearches(limit = 5): string[] {
  return userStore((s) => s.recentSearches.slice(0, limit));
}

function processPersistedState(state: UserState): UserState {
  const validated: UserState = {
    version: state.version,
    favorites: validateIds(state.favorites),
    recentEntities: validateIds(state.recentEntities),
    recentSearches: state.recentSearches,
    session: validateIds(state.session),
  };
  return normalize(validated);
}

function replaceState(state: UserState): void {
  const current = userStore.getState();
  if (
    current.version === state.version &&
    arraysEqual(current.favorites, state.favorites) &&
    arraysEqual(current.recentEntities, state.recentEntities) &&
    arraysEqual(current.recentSearches, state.recentSearches) &&
    arraysEqual(current.session, state.session)
  ) {
    return;
  }
  userStore.getState()._replace(state);
}

export function hydrate(): void {
  const persisted = read();
  const processed = processPersistedState(persisted);

  replaceState(processed);
  userStore.setState({ _hasHydrated: true });

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key !== STORAGE_KEY) return;
      if (!event.newValue) return;
      try {
        const parsed = JSON.parse(event.newValue) as unknown;
        const migrated = migrate(parsed);
        const processed = processPersistedState(migrated);
        replaceState(processed);
      } catch {
        // ignore malformed cross-tab payloads
      }
    });
  }
}
