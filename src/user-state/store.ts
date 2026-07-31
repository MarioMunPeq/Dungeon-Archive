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

interface SceneActions {
  addScene: (adventureId: string, data: { title: string; description?: string; note?: string }) => string | null;
  updateScene: (adventureId: string, sceneId: string, data: { title?: string; description?: string; note?: string }) => void;
  removeScene: (adventureId: string, sceneId: string) => void;
  toggleSceneEntity: (adventureId: string, sceneId: string, canonicalId: string) => void;
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

export type UserStore = UserState & UserActions & AdventureActions & PartyActions & SceneActions & {
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
        scenes: [],
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
      const idx = s.adventures.findIndex((a) => a.id === id);
      if (idx === -1) return s;
      const current = s.adventures[idx]!;
      const updated: Adventure = {
        ...current,
        title: data.title !== undefined ? data.title.trim() || current.title : current.title,
        description: data.description !== undefined ? data.description.trim() : current.description,
        notes: data.notes !== undefined ? data.notes.trim() : current.notes,
        updatedAt: Date.now(),
      };
      const adventures = [...s.adventures];
      adventures[idx] = updated;
      return { adventures, adventureEntitySet: updateActiveAdventureSet(adventures, s.activeAdventureId) };
    });
    schedulePersist(get);
  },

  addObjective: (adventureId, objective) => {
    const trimmed = objective.trim();
    if (!trimmed) return;
    set((s) => {
      const idx = s.adventures.findIndex((a) => a.id === adventureId);
      if (idx === -1) return s;
      const current = s.adventures[idx]!;
      const updated: Adventure = {
        ...current,
        objectives: [...current.objectives, trimmed],
        updatedAt: Date.now(),
      };
      const adventures = [...s.adventures];
      adventures[idx] = updated;
      return { adventures };
    });
    schedulePersist(get);
  },

  removeObjective: (adventureId, index) => {
    set((s) => {
      const idx = s.adventures.findIndex((a) => a.id === adventureId);
      if (idx === -1) return s;
      const current = s.adventures[idx]!;
      const copy = [...current.objectives];
      if (index < 0 || index >= copy.length) return s;
      copy.splice(index, 1);
      const updated: Adventure = {
        ...current,
        objectives: copy,
        updatedAt: Date.now(),
      };
      const adventures = [...s.adventures];
      adventures[idx] = updated;
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
          scenes: [],
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

      const idx = adventures.findIndex((a) => a.id === activeAdventureId);
      if (idx === -1) return s;
      const adventure = adventures[idx]!;
      const entityIdx = adventure.entities.indexOf(canonicalId);
      let newEntities: string[];
      if (entityIdx !== -1) {
        newEntities = [...adventure.entities];
        newEntities.splice(entityIdx, 1);
      } else {
        newEntities = [...adventure.entities, canonicalId];
      }
      const updated: Adventure = {
        ...adventure,
        entities: newEntities,
        updatedAt: Date.now(),
      };
      const newAdventures = [...adventures];
      newAdventures[idx] = updated;

      return {
        adventures: newAdventures,
        adventureEntitySet: new Set(newEntities),
      };
    });
    schedulePersist(get);
  },

  clearAdventureEntities: () => {
    set((s) => {
      if (!s.activeAdventureId) return s;
      const idx = s.adventures.findIndex((a) => a.id === s.activeAdventureId);
      if (idx === -1) return s;
      const current = s.adventures[idx]!;
      const updated: Adventure = {
        ...current,
        entities: [],
        updatedAt: Date.now(),
      };
      const adventures = [...s.adventures];
      adventures[idx] = updated;
      return { adventures, adventureEntitySet: new Set<string>() };
    });
    schedulePersist(get);
  },

  archiveAdventure: (id) => {
    set((s) => {
      const idx = s.adventures.findIndex((a) => a.id === id);
      if (idx === -1) return s;
      const current = s.adventures[idx]!;
      const updated: Adventure = { ...current, archived: true, updatedAt: Date.now() };
      const adventures = [...s.adventures];
      adventures[idx] = updated;
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
      const idx = s.adventures.findIndex((a) => a.id === id);
      if (idx === -1) return s;
      const current = s.adventures[idx]!;
      const updated: Adventure = { ...current, archived: false, updatedAt: Date.now() };
      const adventures = [...s.adventures];
      adventures[idx] = updated;
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

  addScene: (adventureId, data) => {
    const title = data.title.trim();
    if (!title) return null;
    let sceneId: string | null = null;
    set((s) => {
      const idx = s.adventures.findIndex((a) => a.id === adventureId);
      if (idx === -1) return s;
      const current = s.adventures[idx]!;
      const id = generateId();
      sceneId = id;
      const updated: Adventure = {
        ...current,
        scenes: [
          ...current.scenes,
          {
            id,
            title,
            description: data.description?.trim() || undefined,
            note: data.note?.trim() || undefined,
            entities: [],
          },
        ],
        updatedAt: Date.now(),
      };
      const adventures = [...s.adventures];
      adventures[idx] = updated;
      return { adventures };
    });
    schedulePersist(get);
    return sceneId;
  },

  updateScene: (adventureId, sceneId, data) => {
    set((s) => {
      const idx = s.adventures.findIndex((a) => a.id === adventureId);
      if (idx === -1) return s;
      const current = s.adventures[idx]!;
      const sceneIdx = current.scenes.findIndex((sc) => sc.id === sceneId);
      if (sceneIdx === -1) return s;
      const existing = current.scenes[sceneIdx]!;
      const updatedScene = {
        ...existing,
        title: data.title !== undefined ? data.title.trim() || existing.title : existing.title,
        description: data.description !== undefined ? data.description.trim() || undefined : existing.description,
        note: data.note !== undefined ? data.note.trim() || undefined : existing.note,
      };
      const scenes = [...current.scenes];
      scenes[sceneIdx] = updatedScene;
      const updated: Adventure = { ...current, scenes, updatedAt: Date.now() };
      const adventures = [...s.adventures];
      adventures[idx] = updated;
      return { adventures };
    });
    schedulePersist(get);
  },

  removeScene: (adventureId, sceneId) => {
    set((s) => {
      const idx = s.adventures.findIndex((a) => a.id === adventureId);
      if (idx === -1) return s;
      const current = s.adventures[idx]!;
      const updated: Adventure = {
        ...current,
        scenes: current.scenes.filter((sc) => sc.id !== sceneId),
        updatedAt: Date.now(),
      };
      const adventures = [...s.adventures];
      adventures[idx] = updated;
      return { adventures };
    });
    schedulePersist(get);
  },

  toggleSceneEntity: (adventureId, sceneId, canonicalId) => {
    set((s) => {
      const idx = s.adventures.findIndex((a) => a.id === adventureId);
      if (idx === -1) return s;
      const current = s.adventures[idx]!;
      const sceneIdx = current.scenes.findIndex((sc) => sc.id === sceneId);
      if (sceneIdx === -1) return s;
      const scene = current.scenes[sceneIdx]!;
      const entityIdx = scene.entities.indexOf(canonicalId);
      let entities: string[];
      if (entityIdx !== -1) {
        entities = [...scene.entities];
        entities.splice(entityIdx, 1);
      } else {
        entities = [...scene.entities, canonicalId];
      }
      const scenes = [...current.scenes];
      scenes[sceneIdx] = { ...scene, entities };
      const updated: Adventure = { ...current, scenes, updatedAt: Date.now() };
      const adventures = [...s.adventures];
      adventures[idx] = updated;
      return { adventures };
    });
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
      aa.entities.length !== bb.entities.length ||
      aa.scenes.length !== bb.scenes.length
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
