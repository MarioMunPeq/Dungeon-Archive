import { create } from "zustand";
import { useMemo } from "react";
import type {
  AbilityScores,
  Adventure,
  CombatValues,
  HitPoints,
  CharacterReference,
  Theme,
  UserState,
} from "./types";
import { STORAGE_KEY, CURRENT_VERSION, DEFAULT_THEME, isTheme } from "./types";
import { read, write } from "./persistence";
import { migrate } from "./migrations";
import { normalize, validateIds } from "./normalize";
import { toUserState } from "./serialization";

interface AdventureActions {
  createAdventure: (data?: { title?: string; description?: string }) => void;
  updateAdventure: (
    id: string,
    data: { title?: string; description?: string; notes?: string },
  ) => void;
  addObjective: (adventureId: string, objective: string) => void;
  removeObjective: (adventureId: string, index: number) => void;
  toggleAdventureEntity: (canonicalId: string) => void;
  clearAdventureEntities: () => void;
  archiveAdventure: (id: string) => void;
  restoreAdventure: (id: string) => void;
  setActiveAdventure: (id: string | null) => void;
}

export type CharacterReferenceUpdate = Partial<
  Omit<CharacterReference, "id" | "abilityScores" | "combatValues" | "hitPoints">
> & {
  abilityScores?: Partial<AbilityScores>;
  combatValues?: Partial<CombatValues>;
  hitPoints?: Partial<HitPoints>;
};

interface CharacterActions {
  addCharacter: (data: Omit<CharacterReference, "id">) => string;
  updateCharacter: (id: string, data: CharacterReferenceUpdate) => void;
  removeCharacter: (id: string) => void;
  setActiveCharacter: (id: string | null) => void;
}

interface UserActions {
  toggleFavorite: (canonicalId: string) => void;
  addRecentEntity: (canonicalId: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  clearRecentEntities: () => void;
  toggleSession: (canonicalId: string) => void;
  clearSession: () => void;
  setBeginnerMode: (enabled: boolean) => void;
  completeOnboarding: () => void;
  setTheme: (theme: Theme) => void;
  _replace: (state: UserState) => void;
  _reset: () => void;
}

export type UserStore = UserState &
  UserActions &
  AdventureActions &
  CharacterActions & {
    favoritesSet: Set<string>;
    sessionSet: Set<string>;
    adventureEntitySet: Set<string>;
    _hasHydrated: boolean;
  };

function clampInt(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.floor(value)));
}

const clampLevel = (value: number): number => clampInt(value, 1, 20);
const clampCombat = (value: number): number => clampInt(value, 0, 40);
const clampInitiative = (value: number): number => clampInt(value, -5, 20);
const clampScore = (value: number): number => clampInt(value, 1, 30);
const clampHp = (value: number): number => clampInt(value, 0, 9999);
const clampHpMax = (value: number): number => clampInt(value, 1, 9999);

function clampAbilityScores(scores: AbilityScores): AbilityScores {
  return {
    strength: clampScore(scores.strength),
    dexterity: clampScore(scores.dexterity),
    constitution: clampScore(scores.constitution),
    intelligence: clampScore(scores.intelligence),
    wisdom: clampScore(scores.wisdom),
    charisma: clampScore(scores.charisma),
  };
}

function clampHitPoints(hp: HitPoints): HitPoints {
  const max = clampHpMax(hp.max);
  return {
    max,
    current: Math.min(clampHp(hp.current), max),
  };
}

function clampCombatValues(values: CombatValues): CombatValues {
  return {
    armorClass: clampCombat(values.armorClass),
    initiativeModifier: clampInitiative(values.initiativeModifier),
    passivePerception: clampCombat(values.passivePerception),
    spellSaveDc: values.spellSaveDc !== undefined ? clampCombat(values.spellSaveDc) : undefined,
    spellAttackBonus:
      values.spellAttackBonus !== undefined ? clampInitiative(values.spellAttackBonus) : undefined,
  };
}

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
    write(toUserState(getState()));
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

function updateActiveAdventureSet(
  adventures: Adventure[],
  activeAdventureId: string | null,
): Set<string> {
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
  characters: [],
  activeCharacterId: null,
  beginnerMode: true,
  onboardingComplete: false,
  theme: DEFAULT_THEME,
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

  setBeginnerMode: (enabled) => {
    set({ beginnerMode: enabled });
    schedulePersist(get);
  },

  completeOnboarding: () => {
    set({ onboardingComplete: true });
    schedulePersist(get);
  },

  setTheme: (theme) => {
    if (!isTheme(theme)) return;
    set({ theme });
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
      return {
        adventures,
        adventureEntitySet: updateActiveAdventureSet(adventures, s.activeAdventureId),
      };
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

  setActiveCharacter: (id) => {
    set({ activeCharacterId: id });
    schedulePersist(get);
  },

  addCharacter: (data) => {
    const id = generateId();
    set((s) => {
      const reference: CharacterReference = {
        id,
        name: data.name.trim(),
        class: data.class.trim(),
        level: clampLevel(data.level),
        subclass: data.subclass?.trim() || undefined,
        abilityScores: clampAbilityScores(data.abilityScores),
        hitPoints: clampHitPoints(data.hitPoints),
        combatValues: clampCombatValues(data.combatValues),
        knownSpellCanonicalIds: [...data.knownSpellCanonicalIds],
        weaponCanonicalIds: [...data.weaponCanonicalIds],
        magicItemCanonicalIds: [...data.magicItemCanonicalIds],
        activeConditions: [...data.activeConditions],
        note: data.note?.trim() || undefined,
      };
      return { characters: [...s.characters, reference] };
    });
    schedulePersist(get);
    return id;
  },

  updateCharacter: (id, data) => {
    set((s) => {
      const idx = s.characters.findIndex((p) => p.id === id);
      if (idx === -1) return s;
      const current = s.characters[idx]!;
      const updated: CharacterReference = {
        ...current,
        ...data,
        name: data.name !== undefined ? data.name.trim() || current.name : current.name,
        class: data.class !== undefined ? data.class.trim() || current.class : current.class,
        level: data.level !== undefined ? clampLevel(data.level) : current.level,
        subclass:
          data.subclass !== undefined ? data.subclass.trim() || undefined : current.subclass,
        abilityScores:
          data.abilityScores !== undefined
            ? clampAbilityScores({ ...current.abilityScores, ...data.abilityScores })
            : current.abilityScores,
        hitPoints:
          data.hitPoints !== undefined
            ? clampHitPoints({ ...current.hitPoints, ...data.hitPoints })
            : current.hitPoints,
        combatValues:
          data.combatValues !== undefined
            ? clampCombatValues({ ...current.combatValues, ...data.combatValues })
            : current.combatValues,
        knownSpellCanonicalIds:
          data.knownSpellCanonicalIds !== undefined
            ? [...data.knownSpellCanonicalIds]
            : current.knownSpellCanonicalIds,
        weaponCanonicalIds:
          data.weaponCanonicalIds !== undefined
            ? [...data.weaponCanonicalIds]
            : current.weaponCanonicalIds,
        magicItemCanonicalIds:
          data.magicItemCanonicalIds !== undefined
            ? [...data.magicItemCanonicalIds]
            : current.magicItemCanonicalIds,
        activeConditions:
          data.activeConditions !== undefined
            ? [...data.activeConditions]
            : current.activeConditions,
        note: data.note !== undefined ? data.note.trim() || undefined : current.note,
      };
      const characters = [...s.characters];
      characters[idx] = updated;
      return { characters };
    });
    schedulePersist(get);
  },

  removeCharacter: (id) => {
    set((s) => ({
      characters: s.characters.filter((p) => p.id !== id),
      activeCharacterId: s.activeCharacterId === id ? null : s.activeCharacterId,
    }));
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
      characters: state.characters,
      activeCharacterId: state.activeCharacterId,
      beginnerMode: state.beginnerMode,
      onboardingComplete: state.onboardingComplete,
      theme: isTheme(state.theme) ? state.theme : DEFAULT_THEME,
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
      characters: [],
      activeCharacterId: null,
      beginnerMode: true,
      onboardingComplete: false,
      theme: DEFAULT_THEME,
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

export function useActiveCharacter(): CharacterReference | null {
  return userStore((s) => {
    if (!s.activeCharacterId) return null;
    return s.characters.find((p) => p.id === s.activeCharacterId) ?? null;
  });
}

/**
 * The character featured on the home screen: the active character when set,
 * otherwise the first character. Returns a stable object reference so the
 * subscriber only re-renders when the featured character itself changes.
 */
export function usePrimaryCharacter(): CharacterReference | null {
  return userStore((s) => {
    if (s.activeCharacterId) {
      const active = s.characters.find((p) => p.id === s.activeCharacterId);
      if (active) return active;
    }
    return s.characters[0] ?? null;
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

export function useCharacters(): CharacterReference[] {
  return userStore((s) => s.characters);
}

export function useOnboardingComplete(): boolean {
  return userStore((s) => s.onboardingComplete);
}

export function useBeginnerMode(): boolean {
  return userStore((s) => s.beginnerMode);
}

export function useTheme(): Theme {
  return userStore((s) => s.theme);
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
    characters: state.characters,
    activeCharacterId: state.activeCharacterId,
    beginnerMode: state.beginnerMode === true,
    onboardingComplete: state.onboardingComplete === true,
    theme: isTheme(state.theme) ? state.theme : DEFAULT_THEME,
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

function charactersEqual(a: CharacterReference[], b: CharacterReference[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i]!.id !== b[i]!.id || a[i]!.name !== b[i]!.name || a[i]!.level !== b[i]!.level)
      return false;
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
    charactersEqual(current.characters, state.characters) &&
    current.activeCharacterId === state.activeCharacterId &&
    current.beginnerMode === state.beginnerMode &&
    current.onboardingComplete === state.onboardingComplete &&
    current.theme === state.theme
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
