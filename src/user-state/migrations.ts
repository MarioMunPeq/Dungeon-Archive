import type { Adventure, PlayerReference, UserState } from "./types";
import { CURRENT_VERSION, createDefaultState } from "./types";

function legacyMemberToPlayerReference(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as Record<string, unknown>;
  const name = typeof m.name === "string" ? m.name.trim() : "";
  if (!name) return null;

  return {
    id: typeof m.id === "string" && m.id ? m.id : undefined,
    name,
    class: typeof m.class === "string" ? m.class.trim() : "",
    level: typeof m.level === "number" ? m.level : 1,
    subclass:
      typeof m.subclass === "string" && m.subclass.trim() ? m.subclass.trim() : undefined,
    abilityModifiers: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
    combatValues: {
      armorClass: 10,
      initiativeModifier: 0,
      passivePerception:
        typeof m.passivePerception === "number" ? m.passivePerception : 10,
    },
    knownSpellCanonicalIds: Array.isArray(m.knownSpellCanonicalIds) ? m.knownSpellCanonicalIds : [],
    weaponCanonicalIds: Array.isArray(m.equippedWeaponCanonicalIds) ? m.equippedWeaponCanonicalIds : [],
    magicItemCanonicalIds: Array.isArray(m.equippedMagicItemCanonicalIds) ? m.equippedMagicItemCanonicalIds : [],
    note: typeof m.notes === "string" && m.notes.trim() ? m.notes.trim() : undefined,
  };
}

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
  4: (raw) => ({
    version: 4,
    favorites: Array.isArray(raw.favorites) ? raw.favorites : [],
    recentEntities: Array.isArray(raw.recentEntities) ? raw.recentEntities : [],
    recentSearches: Array.isArray(raw.recentSearches) ? raw.recentSearches : [],
    session: Array.isArray(raw.session) ? raw.session : [],
    adventures: Array.isArray(raw.adventures) ? raw.adventures : [],
    activeAdventureId: typeof raw.activeAdventureId === "string" ? raw.activeAdventureId : null,
    party: Array.isArray(raw.party) ? raw.party : [],
  }),
  6: (raw) => {
    const adventures = Array.isArray(raw.adventures)
      ? raw.adventures.map((a) => {
          if (!a || typeof a !== "object") return a;
          const adventure = { ...a } as Record<string, unknown>;
          delete adventure.scenes;
          return adventure;
        })
      : [];
    return {
      ...raw,
      version: 6,
      adventures,
    };
  },
  7: (raw) => {
    const party = Array.isArray(raw.party) ? raw.party : [];
    const players = party
      .map(legacyMemberToPlayerReference)
      .filter((p): p is Record<string, unknown> => p !== null);
    const { party: _legacy, ...rest } = raw;
    return {
      ...rest,
      version: 7,
      players,
    };
  },
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
  if (version < 4) {
    migrated = migrations[4]!(migrated);
  }
  if (version < 6) {
    migrated = migrations[6]!(migrated);
  }
  if (version < 7) {
    migrated = migrations[7]!(migrated);
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
    players: Array.isArray(result.players) ? (result.players as PlayerReference[]) : [],
  };
}
