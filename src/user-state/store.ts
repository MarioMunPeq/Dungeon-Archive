import { create } from "zustand";
import { useMemo } from "react";
import type { Adventure, PartyMember, UserState } from "./types";
import { STORAGE_KEY, CURRENT_VERSION } from "./types";
import { read, write } from "./persistence";
import { migrate } from "./migrations";
import { normalize, validateIds } from "./normalize";

interface AdventureActions {
  createAdventure: (data?: { title?: string; description?: string }) => void;
  updateAdventure: (id: string, data: { title?: string; description?: string; notes?: string }) => void;
  addObjective: (adventureId: string, objective: string) => void;
  removeObjective: (adventureId: string, index: number) => void;
  toggleAdventureEntity: (canonicalId: string) => void;
  clearAdventureEntities: () => void;
  archiveAdventure: (id: string) => void;
  restoreAdventure: (id: string) => void;
  setActiveAdventure: (id: string | null) => void;
}

interface PartyActions {
  addPartyMember: (data: Omit<PartyMember, "id">) => void;
  updatePartyMember: (id: string, data: Partial<Omit<PartyMember, "id">>) => void;
  removePartyMember: (id: string) => void;
}

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

export type UserStore = UserState & UserActions & AdventureActions & PartyActions & {
  favoritesSet: Set<string>;
  sessionSet: Set<string>;
  adventureEntitySet: Set<string>;
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

function mapAdventure(
  adventures: readonly Adventure[],
  id: string,
  update: (adventure: Adventure) => Adventure,
): Adventure[] | null {
  const idx = adventures.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const next = [...adventures];
  next[idx] = update(adventures[idx]!);
  return next;
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePersist(getState: () => UserStore): void {
  if (debounceTimer !== null) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    const { version, favorites, recentEntities, recentSearches, session, adventures, activeAdventureId, party } = getState();
    write({ version, favorites, recentEntities, recentSearches, session, adventures, activeAdventureId, party });
  }, 150);
}

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function updateActiveAdventureSet(adventures: Adventure[], activeAdventureId: string | null): Set<string> {
  const active = activeAdventureId ? adventures.find((a) => a.id === activeAdventureId) : undefined;
  return new Set(active?.entities ?? []);
}

export const userStore = create<UserStore>((set, get) => ({
  version: CURRENT_VERSION,
  favorites: [],
  favoritesSet: new Set<string>(),
  recentEntities: [],
  recentSearches: [],
  session: [],
  sessionSet: new Set<string>(),
  adventures: [],
  activeAdventureId: null,
  adventureEntitySet: new Set<string>(),
  party: [],
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

  createAdventure: (data) => {
    set((s) => {
      const id = generateId();
      const adventure: Adventure = {
        id,
        title: data?.title?.trim() || "New Adventure",
        description: data?.description?.trim() || "",
        objectives: [],
        notes: "",
        entities: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        archived: false,
      };
      return {
        adventures: [...s.adventures, adventure],
        activeAdventureId: id,
        adventureEntitySet: new Set<string>(),
      };
    });
    schedulePersist(get);
  },

  updateAdventure: (id, data) => {
    set((s) => {
      const adventures = mapAdventure(s.adventures, id, (a) => ({
        ...a,
        title: data.title !== undefined ? data.title.trim() || a.title : a.title,
        description: data.description !== undefined ? data.description.trim() : a.description,
        notes: data.notes !== undefined ? data.notes.trim() : a.notes,
        updatedAt: Date.now(),
      }));
      if (!adventures) return s;
      return { adventures, adventureEntitySet: updateActiveAdventureSet(adventures, s.activeAdventureId) };
    });
    schedulePersist(get);
  },

  addObjective: (adventureId, objective) => {
    const trimmed = objective.trim();
    if (!trimmed) return;
    set((s) => {
      const adventures = mapAdventure(s.adventures, adventureId, (a) => ({
        ...a,
        objectives: [...a.objectives, trimmed],
        updatedAt: Date.now(),
      }));
      if (!adventures) return s;
      return { adventures };
    });
    schedulePersist(get);
  },

  removeObjective: (adventureId, index) => {
    set((s) => {
      const adventures = mapAdventure(s.adventures, adventureId, (a) => {
        const copy = [...a.objectives];
        if (index < 0 || index >= copy.length) return a;
        copy.splice(index, 1);
        return { ...a, objectives: copy, updatedAt: Date.now() };
      });
      if (!adventures) return s;
      return { adventures };
    });
    schedulePersist(get);
  },

  toggleAdventureEntity: (canonicalId) => {
    set((s) => {
      const { adventures, activeAdventureId } = s;

      if (!activeAdventureId) {
        const id = generateId();
        const adventure: Adventure = {
          id,
          title: "New Adventure",
          description: "",
          objectives: [],
          notes: "",
          entities: [canonicalId],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          archived: false,
        };
        return {
          adventures: [...adventures, adventure],
          activeAdventureId: id,
          adventureEntitySet: new Set([canonicalId]),
        };
      }

      const next = mapAdventure(adventures, activeAdventureId, (a) => {
        const entityIdx = a.entities.indexOf(canonicalId);
        const entities =
          entityIdx !== -1
            ? a.entities.filter((_, i) => i !== entityIdx)
            : [...a.entities, canonicalId];
        return { ...a, entities, updatedAt: Date.now() };
      });
      if (!next) return s;
      const active = next.find((a) => a.id === activeAdventureId)!;
      return {
        adventures: next,
        adventureEntitySet: new Set(active.entities),
      };
    });
    schedulePersist(get);
  },

  clearAdventureEntities: () => {
    set((s) => {
      if (!s.activeAdventureId) return s;
      const adventures = mapAdventure(s.adventures, s.activeAdventureId, (a) => ({
        ...a,
        entities: [],
        updatedAt: Date.now(),
      }));
      if (!adventures) return s;
      return { adventures, adventureEntitySet: new Set<string>() };
    });
    schedulePersist(get);
  },

  archiveAdventure: (id) => {
    set((s) => {
      const adventures = mapAdventure(s.adventures, id, (a) => ({
        ...a,
        archived: true,
        updatedAt: Date.now(),
      }));
      if (!adventures) return s;
      return {
        adventures,
        activeAdventureId: s.activeAdventureId === id ? null : s.activeAdventureId,
        adventureEntitySet: s.activeAdventureId === id ? new Set<string>() : s.adventureEntitySet,
      };
    });
    schedulePersist(get);
  },

  restoreAdventure: (id) => {
    set((s) => {
      const adventures = mapAdventure(s.adventures, id, (a) => ({
        ...a,
        archived: false,
        updatedAt: Date.now(),
      }));
      if (!adventures) return s;
      return { adventures };
    });
    schedulePersist(get);
  },

  setActiveAdventure: (id) => {
    set((s) => ({
      activeAdventureId: id,
      adventureEntitySet: updateActiveAdventureSet(s.adventures, id),
    }));
    schedulePersist(get);
  },

  addPartyMember: (data) => {
    set((s) => {
      const member: PartyMember = {
        id: generateId(),
        name: data.name.trim(),
        class: data.class.trim(),
        level: Math.max(1, Math.min(20, Math.floor(data.level))),
        race: data.race?.trim() || undefined,
        subclass: data.subclass?.trim() || undefined,
        passivePerception: data.passivePerception,
        passiveInsight: data.passiveInsight,
        passiveInvestigation: data.passiveInvestigation,
        notes: data.notes?.trim() || undefined,
        knownSpellCanonicalIds: [...data.knownSpellCanonicalIds],
        equippedArmorCanonicalId: data.equippedArmorCanonicalId,
        equippedWeaponCanonicalIds: [...data.equippedWeaponCanonicalIds],
        equippedMagicItemCanonicalIds: [...data.equippedMagicItemCanonicalIds],
      };
      return { party: [...s.party, member] };
    });
    schedulePersist(get);
  },

  updatePartyMember: (id, data) => {
    set((s) => {
      const idx = s.party.findIndex((m) => m.id === id);
      if (idx === -1) return s;
      const current = s.party[idx]!;
      const updated: PartyMember = {
        ...current,
        ...data,
        level: data.level !== undefined ? Math.max(1, Math.min(20, Math.floor(data.level))) : current.level,
        name: data.name !== undefined ? data.name.trim() || current.name : current.name,
        class: data.class !== undefined ? data.class.trim() || current.class : current.class,
        race: data.race !== undefined ? data.race.trim() || undefined : current.race,
        subclass: data.subclass !== undefined ? data.subclass.trim() || undefined : current.subclass,
        notes: data.notes !== undefined ? data.notes.trim() || undefined : current.notes,
      };
      const party = [...s.party];
      party[idx] = updated;
      return { party };
    });
    schedulePersist(get);
  },

  removePartyMember: (id) => {
    set((s) => ({ party: s.party.filter((m) => m.id !== id) }));
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
      adventures: state.adventures,
      activeAdventureId: state.activeAdventureId,
      adventureEntitySet: updateActiveAdventureSet(state.adventures, state.activeAdventureId),
      party: state.party,
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
      adventures: [],
      activeAdventureId: null,
      adventureEntitySet: new Set<string>(),
      party: [],
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

export function useIsInAdventure(canonicalId: string): boolean {
  return userStore((s) => s.adventureEntitySet.has(canonicalId));
}

export function useActiveAdventure(): Adventure | null {
  return userStore((s) => {
    if (!s.activeAdventureId) return null;
    return s.adventures.find((a) => a.id === s.activeAdventureId) ?? null;
  });
}

export function useAdventureEntityIds(): string[] {
  const activeAdventureId = userStore((s) => s.activeAdventureId);
  const adventures = userStore((s) => s.adventures);
  return useMemo(() => {
    if (!activeAdventureId) return [];
    const active = adventures.find((a) => a.id === activeAdventureId);
    return active?.entities ?? [];
  }, [activeAdventureId, adventures]);
}

export function useFavoriteIds(limit = 10): string[] {
  const favorites = userStore((s) => s.favorites);
  return useMemo(() => favorites.slice(0, limit), [favorites, limit]);
}

export function useSessionIds(limit?: number): string[] {
  const session = userStore((s) => s.session);
  return useMemo(() => (limit !== undefined ? session.slice(0, limit) : session), [session, limit]);
}

export function useRecentEntities(limit = 10): string[] {
  const recentEntities = userStore((s) => s.recentEntities);
  return useMemo(() => recentEntities.slice(0, limit), [recentEntities, limit]);
}

export function useRecentSearches(limit = 5): string[] {
  const recentSearches = userStore((s) => s.recentSearches);
  return useMemo(() => recentSearches.slice(0, limit), [recentSearches, limit]);
}

export function usePartyMembers(): PartyMember[] {
  return userStore((s) => s.party);
}

function processPersistedState(state: UserState): UserState {
  const validated: UserState = {
    version: state.version,
    favorites: validateIds(state.favorites),
    recentEntities: validateIds(state.recentEntities),
    recentSearches: state.recentSearches,
    session: validateIds(state.session),
    adventures: state.adventures,
    activeAdventureId: state.activeAdventureId,
    party: state.party,
  };
  return normalize(validated);
}

function adventuresEqual(a: Adventure[], b: Adventure[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const aa = a[i]!;
    const bb = b[i]!;
    if (
      aa.id !== bb.id ||
      aa.title !== bb.title ||
      aa.updatedAt !== bb.updatedAt ||
      aa.entities.length !== bb.entities.length
    ) {
      return false;
    }
  }
  return true;
}

function partyEqual(a: PartyMember[], b: PartyMember[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i]!.id !== b[i]!.id || a[i]!.name !== b[i]!.name || a[i]!.level !== b[i]!.level) return false;
  }
  return true;
}

function replaceState(state: UserState): void {
  const current = userStore.getState();
  if (
    current.version === state.version &&
    arraysEqual(current.favorites, state.favorites) &&
    arraysEqual(current.recentEntities, state.recentEntities) &&
    arraysEqual(current.recentSearches, state.recentSearches) &&
    arraysEqual(current.session, state.session) &&
    current.activeAdventureId === state.activeAdventureId &&
    adventuresEqual(current.adventures, state.adventures) &&
    partyEqual(current.party, state.party)
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
