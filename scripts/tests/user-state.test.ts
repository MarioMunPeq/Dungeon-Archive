import { strictEqual, ok, deepStrictEqual } from "node:assert";

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`  \u2713 ${description}`);
  } catch (e) {
    console.error(`  \u2717 ${description}`);
    console.error(`    ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// localStorage mock
// ---------------------------------------------------------------------------
const store = new Map<string, string>();
let localStorageThrows = false;

(globalThis as Record<string, unknown>).localStorage = {
  getItem(key: string): string | null {
    if (localStorageThrows) throw new Error("localStorage unavailable");
    return store.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    if (localStorageThrows) throw new Error("localStorage unavailable");
    store.set(key, value);
  },
  removeItem(key: string): void {
    if (localStorageThrows) throw new Error("localStorage unavailable");
    store.delete(key);
  },
  clear(): void {
    if (localStorageThrows) throw new Error("localStorage unavailable");
    store.clear();
  },
  get length() {
    return store.size;
  },
  key(_index: number): string | null {
    return null;
  },
};

function resetMock(): void {
  store.clear();
  localStorageThrows = false;
}

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------
const { STORAGE_KEY, CURRENT_VERSION, createDefaultState } =
  await import("../../src/user-state/types");
const { migrate } = await import("../../src/user-state/migrations");
const { read, write } = await import("../../src/user-state/persistence");
const { loadCompendium } = await import("../../src/compendium/loader");
const { hydrate, userStore } = await import("../../src/user-state/store");
import type { Adventure, CharacterReference, UserState } from "../../src/user-state/types";
const { normalize, validateIds } = await import("../../src/user-state/normalize");
const { getEntity, getSpells, getEquipmentList, getMagicItems } =
  await import("../../src/compendium/repository");

function resetStore(): void {
  userStore.getState()._reset();
}

// Load compendium once so ID validation works in normalize/hydrate tests.
await loadCompendium();

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
console.log("user-state \u2014 constants\n");

test("STORAGE_KEY equals dungeon:userState:v1", () => {
  strictEqual(STORAGE_KEY, "dungeon:userState:v1");
});

test("CURRENT_VERSION equals 13", () => {
  strictEqual(CURRENT_VERSION, 13);
});

test("createDefaultState returns valid v13 state", () => {
  const def = createDefaultState();
  strictEqual(def.version, CURRENT_VERSION);
  deepStrictEqual(def.favorites, []);
  deepStrictEqual(def.recentEntities, []);
  deepStrictEqual(def.recentSearches, []);
  deepStrictEqual(def.session, []);
  deepStrictEqual(def.adventures, []);
  strictEqual(def.activeAdventureId, null);
  deepStrictEqual(def.characters, []);
  strictEqual(def.activeCharacterId, null);
  strictEqual(def.beginnerMode, true);
  strictEqual(def.onboardingComplete, false);
  strictEqual(def.theme, "teal");
});

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 persistence\n");

test("persistence.read() returns default on missing key", () => {
  resetMock();
  const result = read();
  strictEqual(result.version, CURRENT_VERSION);
  deepStrictEqual(result.favorites, []);
});

test("persistence.read() recovers default on invalid JSON", () => {
  resetMock();
  localStorage.setItem(STORAGE_KEY, "not-json");
  const result = read();
  strictEqual(result.version, CURRENT_VERSION);
  deepStrictEqual(result.favorites, []);
});

test("persistence.read() recovers default on null JSON", () => {
  resetMock();
  localStorage.setItem(STORAGE_KEY, "null");
  const result = read();
  strictEqual(result.version, CURRENT_VERSION);
});

test("persistence.read() recovers default on non-object JSON", () => {
  resetMock();
  localStorage.setItem(STORAGE_KEY, '"string"');
  const result = read();
  strictEqual(result.version, CURRENT_VERSION);
});

test("persistence.write() stores JSON under STORAGE_KEY", () => {
  resetMock();
  const state = createDefaultState();
  state.favorites.push("spell.fireball");
  write(state);
  const stored = localStorage.getItem(STORAGE_KEY);
  ok(stored, "should be stored");
  const parsed = JSON.parse(stored!);
  strictEqual(parsed.version, CURRENT_VERSION);
  deepStrictEqual(parsed.favorites, ["spell.fireball"]);
});

test("persistence.write() does not throw when localStorage is unavailable", () => {
  resetMock();
  localStorageThrows = true;
  const state = createDefaultState();
  write(state);
  ok(true, "should not throw");
});

test("persistence.read() returns default when localStorage is unavailable", () => {
  resetMock();
  localStorageThrows = true;
  const result = read();
  strictEqual(result.version, CURRENT_VERSION);
  deepStrictEqual(result.favorites, []);
});

test("persistence.read() returns default when stored version is unknown (migrate resets)", () => {
  resetMock();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 999, favorites: "invalid" }));
  const result = read();
  strictEqual(result.version, CURRENT_VERSION);
  deepStrictEqual(result.favorites, []);
});

// ---------------------------------------------------------------------------
// Migrations
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 migrations\n");

test("migrations.migrate() returns current version for undefined input", () => {
  const result = migrate(undefined);
  strictEqual(result.version, CURRENT_VERSION);
});

test("migrations.migrate() returns current version for null input", () => {
  const result = migrate(null);
  strictEqual(result.version, CURRENT_VERSION);
});

test("migrations.migrate() preserves valid v1 state", () => {
  const input = { version: 1, favorites: ["a"], recentEntities: ["b"], recentSearches: ["c"] };
  const result = migrate(input);
  deepStrictEqual(result.favorites, ["a"]);
  deepStrictEqual(result.recentEntities, ["b"]);
  deepStrictEqual(result.recentSearches, ["c"]);
});

test("migrations.migrate() converts legacy (no version) to current version", () => {
  const input = { favorites: ["x"], recentEntities: ["y"], recentSearches: ["z"] };
  const result = migrate(input);
  strictEqual(result.version, CURRENT_VERSION);
  deepStrictEqual(result.favorites, ["x"]);
});

test("migrations.migrate() upgrades v4 adventures without a scenes field", () => {
  const input = {
    version: 4,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [
      {
        id: "adv-1",
        title: "Legacy",
        description: "",
        objectives: [],
        notes: "",
        entities: [],
        createdAt: 1000,
        updatedAt: 2000,
        archived: false,
      },
    ],
    activeAdventureId: "adv-1",
    party: [],
  };
  const result = migrate(input);
  strictEqual(result.version, CURRENT_VERSION);
  strictEqual(result.adventures.length, 1);
  strictEqual(result.adventures[0]!.title, "Legacy");
  ok(!("scenes" in result.adventures[0]!));
  deepStrictEqual(result.characters, []);
});

test("migrations.migrate() silently discards obsolete scenes at v6", () => {
  const input = {
    version: 5,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [
      {
        id: "adv-1",
        title: "Current",
        description: "Desc",
        objectives: [],
        notes: "Notes",
        entities: ["spell.fireball"],
        scenes: [
          {
            id: "sc-1",
            title: "Tavern",
            description: "Intro",
            note: "Hook",
            entities: ["monster.goblin"],
          },
        ],
        createdAt: 1000,
        updatedAt: 2000,
        archived: false,
      },
    ],
    activeAdventureId: "adv-1",
    party: [],
  };
  const result = migrate(input);
  strictEqual(result.version, CURRENT_VERSION);
  strictEqual(result.adventures.length, 1);
  const adventure = result.adventures[0]!;
  ok(!("scenes" in adventure), "scenes field removed during migration");
  strictEqual(adventure.title, "Current");
  strictEqual(adventure.description, "Desc");
  strictEqual(adventure.notes, "Notes");
  deepStrictEqual(adventure.entities, ["spell.fireball"]);
});

test("migrations.migrate() maps legacy party members to character references at v7", () => {
  const input = {
    version: 6,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    party: [
      {
        id: "m1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        race: "High Elf",
        subclass: "Evocation",
        passivePerception: 15,
        passiveInsight: 12,
        passiveInvestigation: 13,
        notes: "Guild wizard",
        knownSpellCanonicalIds: ["spell.fireball"],
        equippedArmorCanonicalId: "equipment.chain-mail",
        equippedWeaponCanonicalIds: ["equipment.longsword"],
        equippedMagicItemCanonicalIds: ["magicitem.wand-of-magic-missiles"],
      },
    ],
  };
  const result = migrate(input);
  strictEqual(result.version, CURRENT_VERSION);
  strictEqual(result.characters.length, 1);
  const character = result.characters[0]!;
  strictEqual(character.id, "m1");
  strictEqual(character.name, "Lyra");
  strictEqual(character.class, "Wizard");
  strictEqual(character.level, 5);
  strictEqual(character.subclass, "Evocation");
  strictEqual(character.note, "Guild wizard");
  strictEqual(character.combatValues.passivePerception, 15);
  strictEqual(character.combatValues.armorClass, 10);
  deepStrictEqual(character.abilityScores, {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });
  deepStrictEqual(character.hitPoints, { current: 10, max: 10 });
  deepStrictEqual(character.knownSpellCanonicalIds, ["spell.fireball"]);
  deepStrictEqual(character.weaponCanonicalIds, ["equipment.longsword"]);
  deepStrictEqual(character.magicItemCanonicalIds, ["magicitem.wand-of-magic-missiles"]);
  ok(!("party" in result), "legacy party key removed");
});

test("migrations.migrate() drops legacy party members without a name", () => {
  const input = {
    version: 6,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    party: [
      { id: "m1", name: "  ", class: "Fighter", level: 3 },
      { id: "m2", name: "Lyra", class: "Wizard", level: 5 },
    ],
  };
  const result = migrate(input);
  strictEqual(result.characters.length, 1);
  strictEqual(result.characters[0]!.id, "m2");
});

test("migrations.migrate() leaves onboarding open for an empty v7 state", () => {
  const input = {
    version: 7,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    players: [],
  };
  const result = migrate(input);
  strictEqual(result.version, CURRENT_VERSION);
  strictEqual(result.onboardingComplete, false);
});

test("migrations.migrate() skips onboarding for existing users with data", () => {
  const input = {
    version: 7,
    favorites: ["spell.fireball"],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    players: [],
  };
  const result = migrate(input);
  strictEqual(result.version, CURRENT_VERSION);
  strictEqual(result.onboardingComplete, true);
});

test("migrations.migrate() preserves an explicit onboardingComplete flag", () => {
  const input = {
    version: 7,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    players: [],
    onboardingComplete: true,
  };
  const result = migrate(input);
  strictEqual(result.onboardingComplete, true);
});

test("migrations.migrate() adds activeCharacterId null to a v8 state", () => {
  const input = {
    version: 8,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    players: [{ id: "p1", name: "Lyra", class: "Wizard", level: 5 }],
    onboardingComplete: true,
  };
  const result = migrate(input);
  strictEqual(result.version, CURRENT_VERSION);
  strictEqual(result.activeCharacterId, null);
  strictEqual(result.characters[0]!.id, "p1");
});

test("migrations.migrate() preserves an existing activeCharacterId", () => {
  const input = {
    version: 8,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    players: [{ id: "p1", name: "Lyra", class: "Wizard", level: 5 }],
    activePlayerId: "p1",
    onboardingComplete: true,
  };
  const result = migrate(input);
  strictEqual(result.version, CURRENT_VERSION);
  strictEqual(result.activeCharacterId, "p1");
});

test("migrations.migrate() defaults beginnerMode to true", () => {
  const input = {
    version: 9,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    players: [],
    activePlayerId: null,
    onboardingComplete: true,
  };
  const result = migrate(input);
  strictEqual(result.version, CURRENT_VERSION);
  strictEqual(result.beginnerMode, true);
});

test("migrations.migrate() preserves an explicit beginnerMode", () => {
  const input = {
    version: 9,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    players: [],
    activePlayerId: null,
    beginnerMode: false,
    onboardingComplete: true,
  };
  const result = migrate(input);
  strictEqual(result.version, CURRENT_VERSION);
  strictEqual(result.beginnerMode, false);
});

test("migrations.migrate() derives abilityScores from legacy abilityModifiers at v10", () => {
  const input = {
    version: 9,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    players: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        abilityModifiers: {
          strength: -5,
          dexterity: 10,
          constitution: 0,
          intelligence: 3,
          wisdom: 0,
          charisma: 0,
        },
        combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
        knownSpellCanonicalIds: [],
        weaponCanonicalIds: [],
        magicItemCanonicalIds: [],
      },
    ],
    activePlayerId: null,
    onboardingComplete: true,
  };
  const result = migrate(input);
  const character = result.characters[0]!;
  deepStrictEqual(character.abilityScores, {
    strength: 1,
    dexterity: 30,
    constitution: 10,
    intelligence: 16,
    wisdom: 10,
    charisma: 10,
  });
  deepStrictEqual(character.hitPoints, { current: 10, max: 10 });
  ok(!("abilityModifiers" in character), "legacy abilityModifiers removed");
});

test("migrations.migrate() preserves explicit abilityScores and hitPoints", () => {
  const input = {
    version: 10,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    players: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        abilityScores: {
          strength: 8,
          dexterity: 14,
          constitution: 12,
          intelligence: 18,
          wisdom: 10,
          charisma: 11,
        },
        hitPoints: { current: 32, max: 40 },
        combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
        knownSpellCanonicalIds: [],
        weaponCanonicalIds: [],
        magicItemCanonicalIds: [],
      },
    ],
    activePlayerId: null,
    beginnerMode: false,
    onboardingComplete: true,
  };
  const result = migrate(input);
  const character = result.characters[0]!;
  deepStrictEqual(character.abilityScores, {
    strength: 8,
    dexterity: 14,
    constitution: 12,
    intelligence: 18,
    wisdom: 10,
    charisma: 11,
  });
  deepStrictEqual(character.hitPoints, { current: 32, max: 40 });
  strictEqual(result.beginnerMode, false);
});

test("migrations.migrate() renames players/activePlayerId to characters/activeCharacterId at v13", () => {
  const input = {
    version: 12,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    players: [{ id: "p1", name: "Lyra", class: "Wizard", level: 5 }],
    activePlayerId: "p1",
    beginnerMode: true,
    onboardingComplete: true,
    theme: "teal",
  };
  const result = migrate(input);
  strictEqual(result.version, CURRENT_VERSION);
  deepStrictEqual(result.characters, [
    { id: "p1", name: "Lyra", class: "Wizard", level: 5 },
  ]);
  strictEqual(result.activeCharacterId, "p1");
  ok(!("players" in result), "legacy players key removed");
  ok(!("activePlayerId" in result), "legacy activePlayerId key removed");
});

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 normalization\n");

test("normalize removes duplicate favorites", () => {
  const result = normalize({
    version: 1,
    favorites: ["a", "b", "a", "c", "b"],
    recentEntities: [],
    recentSearches: [],
    session: [],
  });
  deepStrictEqual(result.favorites, ["a", "b", "c"]);
});

test("normalize preserves insertion order (first occurrence wins)", () => {
  const result = normalize({
    version: 1,
    favorites: ["c", "a", "b", "a"],
    recentEntities: [],
    recentSearches: [],
    session: [],
  });
  deepStrictEqual(result.favorites, ["c", "a", "b"]);
});

test("normalize removes empty strings from favorites", () => {
  const result = normalize({
    version: 1,
    favorites: ["a", "", "b", "  ", "c"],
    recentEntities: [],
    recentSearches: [],
    session: [],
  });
  deepStrictEqual(result.favorites, ["a", "b", "c"]);
});

test("normalize removes non-string values from favorites", () => {
  const result = normalize({
    version: 1,
    favorites: ["a", 123 as unknown as string, null as unknown as string, "b"],
    recentEntities: [],
    recentSearches: [],
    session: [],
  });
  deepStrictEqual(result.favorites, ["a", "b"]);
});

test("normalize deduplicates recent entities, keeps first occurrence", () => {
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: ["a", "b", "c", "a", "d", "b"],
    recentSearches: [],
    session: [],
  });
  deepStrictEqual(result.recentEntities, ["a", "b", "c", "d"]);
});

test("normalize enforces max 50 recent entities", () => {
  const many: string[] = [];
  for (let i = 0; i < 60; i++) many.push(`e-${i}`);
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: many,
    recentSearches: [],
    session: [],
  });
  strictEqual(result.recentEntities.length, 50);
  strictEqual(result.recentEntities[0], "e-0");
  strictEqual(result.recentEntities[49], "e-49");
});

test("normalize deduplicates recent searches", () => {
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: [],
    recentSearches: ["fireball", "magic missile", "fireball", "shield"],
    session: [],
  });
  deepStrictEqual(result.recentSearches, ["fireball", "magic missile", "shield"]);
});

test("normalize trims whitespace from searches", () => {
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: [],
    recentSearches: ["  fireball  ", "shield", " magic "],
    session: [],
  });
  deepStrictEqual(result.recentSearches, ["fireball", "shield", "magic"]);
});

test("normalize removes empty searches after trim", () => {
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: [],
    recentSearches: ["fireball", "", "  ", "shield"],
    session: [],
  });
  deepStrictEqual(result.recentSearches, ["fireball", "shield"]);
});

test("normalize enforces max 20 recent searches", () => {
  const many: string[] = [];
  for (let i = 0; i < 30; i++) many.push(`q-${i}`);
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: [],
    recentSearches: many,
    session: [],
  });
  strictEqual(result.recentSearches.length, 20);
  strictEqual(result.recentSearches[0], "q-0");
  strictEqual(result.recentSearches[19], "q-19");
});

test("normalize handles non-array favorites gracefully", () => {
  const result = normalize({
    version: 1,
    favorites: "invalid" as unknown as string[],
    recentEntities: [],
    recentSearches: [],
    session: [],
  });
  deepStrictEqual(result.favorites, []);
});

test("normalize handles non-array recentEntities gracefully", () => {
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: null as unknown as string[],
    recentSearches: [],
    session: [],
  });
  deepStrictEqual(result.recentEntities, []);
});

test("normalize handles non-array recentSearches gracefully", () => {
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: [],
    recentSearches: 123 as unknown as string[],
    session: [],
  });
  deepStrictEqual(result.recentSearches, []);
});

test("normalize sets version to CURRENT_VERSION", () => {
  const result = normalize(createDefaultState());
  strictEqual(result.version, CURRENT_VERSION);
});

test("normalize preserves onboardingComplete when true", () => {
  const result = normalize({ ...createDefaultState(), onboardingComplete: true });
  strictEqual(result.onboardingComplete, true);
});

test("normalize treats missing onboardingComplete as false", () => {
  const result = normalize({ ...createDefaultState(), onboardingComplete: false });
  strictEqual(result.onboardingComplete, false);
});

test("normalize with validateIds removes stale IDs (with compendium loaded)", () => {
  const raw = {
    version: 1,
    favorites: ["spell.fireball", "nonexistent.entity"],
    recentEntities: ["monster.goblin"],
    recentSearches: [],
    session: [],
  };
  const validated = {
    ...raw,
    favorites: validateIds(raw.favorites),
    recentEntities: validateIds(raw.recentEntities),
  };
  const result = normalize(validated);
  deepStrictEqual(result.favorites, ["spell.fireball"], "stale favorite removed");
  deepStrictEqual(result.recentEntities, ["monster.goblin"], "stale recent entity removed");
});

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 store\n");

test("store initial state has favoritesSet and _hasHydrated", () => {
  resetMock();
  resetStore();
  const state = userStore.getState();
  ok(state.favoritesSet instanceof Set, "favoritesSet is a Set");
  strictEqual(state._hasHydrated, false);
  strictEqual(state.favoritesSet.size, 0);
});

test("favoritesSet stays in sync with favorites", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleFavorite("spell.fireball");
  const state = userStore.getState();
  strictEqual(state.favoritesSet.has("spell.fireball"), true);
  strictEqual(state.favoritesSet.size, 1);
});

test("favoritesSet rebuilt on toggle remove", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleFavorite("a");
  s.toggleFavorite("b");
  s.toggleFavorite("a");
  const state = userStore.getState();
  strictEqual(state.favoritesSet.has("a"), false);
  strictEqual(state.favoritesSet.has("b"), true);
  strictEqual(state.favoritesSet.size, 1);
});

test("favoritesSet rebuilt on _replace", () => {
  resetMock();
  resetStore();
  userStore.getState()._replace({
    version: CURRENT_VERSION,
    favorites: ["x", "y"],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: "jade",
  });
  const state = userStore.getState();
  strictEqual(state.favoritesSet.has("x"), true);
  strictEqual(state.favoritesSet.has("y"), true);
  strictEqual(state.favoritesSet.size, 2);
});

test("favoritesSet rebuilt on _reset", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleFavorite("a");
  userStore.getState()._reset();
  strictEqual(userStore.getState().favoritesSet.size, 0);
});

// ---------------------------------------------------------------------------
// Beginner mode
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 beginner mode\n");

test("beginnerMode defaults to true in default state", () => {
  strictEqual(createDefaultState().beginnerMode, true);
});

test("normalize defaults beginnerMode to true when missing", () => {
  const result = normalize(createDefaultState());
  strictEqual(result.beginnerMode, true);
});

test("normalize preserves beginnerMode false", () => {
  const result = normalize({ ...createDefaultState(), beginnerMode: false });
  strictEqual(result.beginnerMode, false);
});

test("setBeginnerMode updates the flag", () => {
  resetMock();
  resetStore();
  userStore.getState().setBeginnerMode(false);
  strictEqual(userStore.getState().beginnerMode, false);
  userStore.getState().setBeginnerMode(true);
  strictEqual(userStore.getState().beginnerMode, true);
});

test("setBeginnerMode persists to localStorage", () => {
  resetMock();
  resetStore();
  userStore.getState().setBeginnerMode(false);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    strictEqual(parsed.beginnerMode, false);
  } else {
    strictEqual(userStore.getState().beginnerMode, false);
  }
});

test("hydrate() loads persisted beginnerMode", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: false,
    onboardingComplete: false,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  strictEqual(userStore.getState().beginnerMode, false);
});

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 theme\n");

test("theme defaults to teal in default state", () => {
  strictEqual(createDefaultState().theme, "teal");
});

test("normalize defaults theme to teal when missing", () => {
  const result = normalize(createDefaultState());
  strictEqual(result.theme, "teal");
});

test("normalize preserves a non-default theme", () => {
  const result = normalize({ ...createDefaultState(), theme: "amber" });
  strictEqual(result.theme, "amber");
});

test("normalize falls back to teal for an invalid theme", () => {
  const result = normalize({ ...createDefaultState(), theme: "red" as never });
  strictEqual(result.theme, "teal");
});

test("migrate defaults theme to teal for a v11 state", () => {
  const input = {
    version: 11,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: true,
  };
  const result = migrate(input);
  strictEqual(result.version, CURRENT_VERSION);
  strictEqual(result.theme, "teal");
});

test("migrate preserves a persisted theme", () => {
  const input = {
    version: 11,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: true,
    theme: "teal",
  };
  const result = migrate(input);
  strictEqual(result.theme, "teal");
});

test("migrate rejects an invalid theme value", () => {
  const input = {
    version: 11,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: true,
    theme: "neon",
  };
  const result = migrate(input);
  strictEqual(result.theme, "teal");
});

test("setTheme updates the theme", () => {
  resetMock();
  resetStore();
  userStore.getState().setTheme("teal");
  strictEqual(userStore.getState().theme, "teal");
  userStore.getState().setTheme("jade");
  strictEqual(userStore.getState().theme, "jade");
});

test("setTheme ignores invalid themes", () => {
  resetMock();
  resetStore();
  userStore.getState().setTheme("neon" as never);
  strictEqual(userStore.getState().theme, "teal");
});

test("setTheme persists to localStorage", () => {
  resetMock();
  resetStore();
  userStore.getState().setTheme("amber");
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    strictEqual(parsed.theme, "amber");
  } else {
    strictEqual(userStore.getState().theme, "amber");
  }
});

test("hydrate() loads persisted theme", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: "teal",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  strictEqual(userStore.getState().theme, "teal");
});

test("hydrate() falls back to teal for an invalid persisted theme", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: "neon",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  strictEqual(userStore.getState().theme, "teal");
});

test("_reset restores the default theme", () => {
  resetMock();
  resetStore();
  userStore.getState().setTheme("amber");
  userStore.getState()._reset();
  strictEqual(userStore.getState().theme, "teal");
});

test("_replace carries the theme field", () => {
  resetMock();
  resetStore();
  userStore.getState()._replace({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: "teal",
  });
  strictEqual(userStore.getState().theme, "teal");
});

test("toUserState includes the theme field", async () => {
  const { toUserState } = await import("../../src/user-state/serialization");
  const serialized = toUserState({ ...createDefaultState(), theme: "amber" });
  strictEqual(serialized.theme, "amber");
});

// ---------------------------------------------------------------------------
// Favorites
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 favorites\n");

test("toggleFavorite adds a new favorite", () => {
  resetMock();
  resetStore();
  userStore.getState().toggleFavorite("spell.fireball");
  deepStrictEqual(userStore.getState().favorites, ["spell.fireball"]);
});

test("toggleFavorite removes existing favorite (toggle behavior)", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleFavorite("spell.fireball");
  s.toggleFavorite("spell.fireball");
  deepStrictEqual(userStore.getState().favorites, []);
});

test("toggleFavorite preserves insertion order", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleFavorite("a");
  s.toggleFavorite("b");
  s.toggleFavorite("c");
  deepStrictEqual(userStore.getState().favorites, ["a", "b", "c"]);
});

test("toggleFavorite re-toggling removes correctly", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleFavorite("a");
  s.toggleFavorite("b");
  s.toggleFavorite("a");
  deepStrictEqual(userStore.getState().favorites, ["b"]);
});

test("toggleFavorite persists to localStorage", () => {
  resetMock();
  resetStore();
  userStore.getState().toggleFavorite("spell.fireball");
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    ok(parsed.favorites.includes("spell.fireball"), "favorite persisted");
  } else {
    ok(userStore.getState().favorites.includes("spell.fireball"));
  }
});

// ---------------------------------------------------------------------------
// Recent Entities
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 recent entities\n");

test("addRecentEntity moves existing to front", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.addRecentEntity("a");
  s.addRecentEntity("b");
  s.addRecentEntity("c");
  s.addRecentEntity("a");
  deepStrictEqual(userStore.getState().recentEntities, ["a", "c", "b"]);
});

test("addRecentEntity keeps newest-first order", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.addRecentEntity("first");
  s.addRecentEntity("second");
  s.addRecentEntity("third");
  deepStrictEqual(userStore.getState().recentEntities, ["third", "second", "first"]);
});

test("addRecentEntity respects max 50", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  for (let i = 0; i < 60; i++) {
    s.addRecentEntity(`entity-${i}`);
  }
  strictEqual(userStore.getState().recentEntities.length, 50);
  strictEqual(userStore.getState().recentEntities[0], "entity-59");
});

// ---------------------------------------------------------------------------
// Recent Searches
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 recent searches\n");

test("addRecentSearch trims whitespace", () => {
  resetMock();
  resetStore();
  userStore.getState().addRecentSearch("  fireball  ");
  deepStrictEqual(userStore.getState().recentSearches, ["fireball"]);
});

test("addRecentSearch ignores empty string", () => {
  resetMock();
  resetStore();
  userStore.getState().addRecentSearch("");
  userStore.getState().addRecentSearch("   ");
  deepStrictEqual(userStore.getState().recentSearches, []);
});

test("addRecentSearch keeps uniqueness, newest-first", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.addRecentSearch("a");
  s.addRecentSearch("b");
  s.addRecentSearch("a");
  deepStrictEqual(userStore.getState().recentSearches, ["a", "b"]);
});

test("addRecentSearch respects max 20", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  for (let i = 0; i < 30; i++) {
    s.addRecentSearch(`query-${i}`);
  }
  strictEqual(userStore.getState().recentSearches.length, 20);
  strictEqual(userStore.getState().recentSearches[0], "query-29");
});

test("clearRecentSearches empties the list", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.addRecentSearch("test");
  s.clearRecentSearches();
  deepStrictEqual(userStore.getState().recentSearches, []);
});

test("clearRecentEntities empties the list", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.addRecentEntity("test");
  s.clearRecentEntities();
  deepStrictEqual(userStore.getState().recentEntities, []);
});

// ---------------------------------------------------------------------------
// Hydration
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 hydration\n");

test("hydrate() does not throw in non-browser environment", () => {
  resetMock();
  resetStore();
  hydrate();
  ok(true, "should not throw");
});

test("hydrate() recovers from corrupted localStorage without throwing", () => {
  resetMock();
  resetStore();
  localStorage.setItem(STORAGE_KEY, "corrupted{{{json");
  hydrate();
  const state = userStore.getState();
  strictEqual(state.version, CURRENT_VERSION, "should recover to current version default");
  ok(Array.isArray(state.favorites));
  ok(state.favoritesSet instanceof Set);
});

test("hydrate() loads valid persisted state", () => {
  resetMock();
  resetStore();
  const data = {
    version: 1,
    favorites: ["spell.fireball"],
    recentEntities: [],
    recentSearches: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(userStore.getState().favorites, ["spell.fireball"]);
});

test("hydrate() sets _hasHydrated to true", () => {
  resetMock();
  resetStore();
  hydrate();
  strictEqual(userStore.getState()._hasHydrated, true);
});

test("hydrate() rebuilds favoritesSet", () => {
  resetMock();
  resetStore();
  const data = {
    version: 1,
    favorites: ["spell.fireball", "monster.goblin"],
    recentEntities: [],
    recentSearches: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  const state = userStore.getState();
  ok(state.favoritesSet instanceof Set);
  strictEqual(state.favoritesSet.has("spell.fireball"), true);
  strictEqual(state.favoritesSet.has("monster.goblin"), true);
});

test("hydrate() removes stale favorite IDs", () => {
  resetMock();
  resetStore();
  const data = {
    version: 1,
    favorites: ["nonexistent.entity"],
    recentEntities: [],
    recentSearches: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(userStore.getState().favorites, [], "stale favorite removed");
  strictEqual(userStore.getState().favoritesSet.size, 0);
});

test("hydrate() removes stale recent entity IDs", () => {
  resetMock();
  resetStore();
  const data = {
    version: 1,
    favorites: [],
    recentEntities: ["nonexistent.entity"],
    recentSearches: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(userStore.getState().recentEntities, [], "stale recent entity removed");
});

test("hydrate() removes duplicate favorites from persistence", () => {
  resetMock();
  resetStore();
  const data = {
    version: 1,
    favorites: ["spell.fireball", "spell.fireball", "monster.goblin", "spell.fireball"],
    recentEntities: [],
    recentSearches: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(
    userStore.getState().favorites,
    ["spell.fireball", "monster.goblin"],
    "duplicates removed",
  );
});

test("hydrate() removes duplicate searches from persistence", () => {
  resetMock();
  resetStore();
  const data = {
    version: 1,
    favorites: [],
    recentEntities: [],
    recentSearches: ["fireball", "fireball", "shield", "fireball"],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(
    userStore.getState().recentSearches,
    ["fireball", "shield"],
    "duplicate searches removed",
  );
});

test("hydrate() preserves valid entity IDs and removes stale ones", () => {
  resetMock();
  resetStore();
  const data = {
    version: 1,
    favorites: ["spell.fireball", "nonexistent.entity"],
    recentEntities: ["monster.goblin"],
    recentSearches: [],
  };

  const fireball = getEntity("spell", "fireball");
  const goblin = getEntity("monster", "goblin");

  if (fireball && goblin) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    hydrate();
    deepStrictEqual(
      userStore.getState().favorites,
      ["spell.fireball"],
      "valid favorite preserved, stale removed",
    );
    deepStrictEqual(
      userStore.getState().recentEntities,
      ["monster.goblin"],
      "valid recent entity preserved",
    );
  } else {
    hydrate();
    ok(true, "hydrate did not throw with mixed valid/invalid IDs");
  }
});

// ---------------------------------------------------------------------------
// Cross-tab
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 cross-tab\n");

test("cross-tab listener ignores identical state", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: ["spell.fireball"],
    recentEntities: [],
    recentSearches: [],
    session: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();

  const current = userStore.getState();
  const currentStr = JSON.stringify({
    version: current.version,
    favorites: current.favorites,
    recentEntities: current.recentEntities,
    recentSearches: current.recentSearches,
    session: current.session,
  });
  strictEqual(currentStr, JSON.stringify(data), "state serialization matches stored data");
});

test("safe replace does nothing when state is identical", () => {
  resetMock();
  resetStore();
  userStore.getState()._replace({
    version: CURRENT_VERSION,
    favorites: ["a", "b"],
    recentEntities: ["x"],
    recentSearches: ["q"],
    session: [],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: "jade",
  });
  userStore.getState()._replace({
    version: CURRENT_VERSION,
    favorites: ["a", "b"],
    recentEntities: ["x"],
    recentSearches: ["q"],
    session: [],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: "jade",
  });
  const state2 = userStore.getState();
  deepStrictEqual(state2.favorites, ["a", "b"]);
  deepStrictEqual(state2.session, []);
});

// ---------------------------------------------------------------------------
// Pipeline Integration
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 pipeline\n");

test("migrate + normalize pipeline recovers gracefully from malformed object", () => {
  const migrated = migrate({
    version: 1,
    favorites: "bad",
    recentEntities: null,
    recentSearches: [1, 2, 3],
  });
  const result = normalize(migrated);
  deepStrictEqual(result.favorites, []);
  deepStrictEqual(result.recentEntities, []);
  deepStrictEqual(result.recentSearches, []);
});

test("migrate + normalize pipeline handles missing fields", () => {
  const migrated = migrate({ version: 1 });
  const result = normalize(migrated);
  deepStrictEqual(result.favorites, []);
  deepStrictEqual(result.recentEntities, []);
  deepStrictEqual(result.recentSearches, []);
});

// ---------------------------------------------------------------------------
// Performance
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 performance\n");

test("favoritesSet provides O(1) lookup", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleFavorite("spell.fireball");
  s.toggleFavorite("monster.goblin");
  s.toggleFavorite("equipment.quarterstaff");

  const state = userStore.getState();
  strictEqual(state.favoritesSet.has("spell.fireball"), true);
  strictEqual(state.favoritesSet.has("nonexistent"), false);
  ok(state.favoritesSet instanceof Set);
  ok(!Array.isArray(state.favoritesSet));
});

test("favoritesSet O(1) lookup works after hydrate", () => {
  resetMock();
  resetStore();
  const data = {
    version: 1,
    favorites: ["spell.fireball", "monster.goblin"],
    recentEntities: [],
    recentSearches: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  const state = userStore.getState();
  strictEqual(state.favoritesSet.has("spell.fireball"), true, "O(1) after hydrate");
});

test("useIsFavorite hook selector returns correct boolean", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleFavorite("spell.fireball");
  const state2 = userStore.getState();
  strictEqual(state2.favoritesSet.has("spell.fireball"), true, "favoritesSet O(1) lookup works");
});

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 session\n");

test("session initial state is empty", () => {
  resetMock();
  resetStore();
  deepStrictEqual(userStore.getState().session, []);
  ok(userStore.getState().sessionSet instanceof Set);
  strictEqual(userStore.getState().sessionSet.size, 0);
});

test("toggleSession adds entity to front of empty session", () => {
  resetMock();
  resetStore();
  userStore.getState().toggleSession("spell.fireball");
  deepStrictEqual(userStore.getState().session, ["spell.fireball"]);
});

test("toggleSession adds new entities to front (newest first)", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleSession("a");
  s.toggleSession("b");
  s.toggleSession("c");
  deepStrictEqual(userStore.getState().session, ["c", "b", "a"]);
});

test("toggleSession with existing entity removes it (toggle-off)", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleSession("a");
  s.toggleSession("b");
  s.toggleSession("c");
  s.toggleSession("a");
  // "a" was already in session, so toggle removes it
  deepStrictEqual(userStore.getState().session, ["c", "b"]);
});

test("toggleSession removes entity when already present", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleSession("spell.fireball");
  s.toggleSession("monster.goblin");
  s.toggleSession("spell.fireball");
  deepStrictEqual(userStore.getState().session, ["monster.goblin"]);
});

test("toggleSession with single item removes it (session empty)", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleSession("a");
  s.toggleSession("a");
  deepStrictEqual(userStore.getState().session, []);
});

test("sessionSet stays in sync with session after toggle", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleSession("a");
  s.toggleSession("b");
  ok(userStore.getState().sessionSet.has("a"));
  ok(userStore.getState().sessionSet.has("b"));
  strictEqual(userStore.getState().sessionSet.size, 2);
});

test("sessionSet updated after remove", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleSession("a");
  s.toggleSession("b");
  s.toggleSession("a");
  const state = userStore.getState();
  ok(!state.sessionSet.has("a"));
  ok(state.sessionSet.has("b"));
  strictEqual(state.sessionSet.size, 1);
});

test("clearSession empties session and sessionSet", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleSession("a");
  s.toggleSession("b");
  s.clearSession();
  const state = userStore.getState();
  deepStrictEqual(state.session, []);
  strictEqual(state.sessionSet.size, 0);
});

test("toggleSession persists to localStorage", () => {
  resetMock();
  resetStore();
  userStore.getState().toggleSession("spell.fireball");
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    ok(parsed.session.includes("spell.fireball"), "session persisted");
  } else {
    ok(userStore.getState().session.includes("spell.fireball"));
  }
});

test("clearSession persists empty session to localStorage", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleSession("a");
  s.clearSession();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    deepStrictEqual(parsed.session, []);
  }
});

test("sessionSet stays in sync after _replace", () => {
  resetMock();
  resetStore();
  userStore.getState()._replace({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["x", "y"],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: "jade",
  });
  const state = userStore.getState();
  deepStrictEqual(state.session, ["x", "y"]);
  ok(state.sessionSet.has("x"));
  ok(state.sessionSet.has("y"));
  strictEqual(state.sessionSet.size, 2);
});

test("sessionSet cleared on _reset", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleSession("a");
  userStore.getState()._reset();
  const state = userStore.getState();
  deepStrictEqual(state.session, []);
  strictEqual(state.sessionSet.size, 0);
});

// ---------------------------------------------------------------------------
// Session normalization
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 session normalization\n");

test("normalize deduplicates session IDs", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["a", "b", "a", "c", "b"],
  });
  deepStrictEqual(result.session, ["a", "b", "c"]);
});

test("normalize preserves session insertion order (first wins)", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["c", "a", "b", "a"],
  });
  deepStrictEqual(result.session, ["c", "a", "b"]);
});

test("normalize removes empty strings from session", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["a", "", "b", "  ", "c"],
  });
  deepStrictEqual(result.session, ["a", "b", "c"]);
});

test("normalize removes non-string values from session", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["a", 123 as unknown as string, null as unknown as string, "b"],
  });
  deepStrictEqual(result.session, ["a", "b"]);
});

test("normalize handles non-array session gracefully", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: "invalid" as unknown as string[],
  });
  deepStrictEqual(result.session, []);
});

test("normalize enforces max 100 session IDs", () => {
  const many: string[] = [];
  for (let i = 0; i < 120; i++) many.push(`s-${i}`);
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: many,
  });
  strictEqual(result.session.length, 100);
  strictEqual(result.session[0], "s-0");
  strictEqual(result.session[99], "s-99");
});

test("normalize with validateIds removes stale session IDs", () => {
  const raw = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["spell.fireball", "nonexistent.entity"],
  };
  const validated: typeof raw = {
    ...raw,
    session: validateIds(raw.session),
  };
  const result = normalize(validated);
  deepStrictEqual(result.session, ["spell.fireball"], "stale session ID removed");
});

// ---------------------------------------------------------------------------
// Session hydrate
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 session hydration\n");

test("hydrate() loads session from persisted state", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["spell.fireball", "monster.goblin"],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(userStore.getState().session, ["spell.fireball", "monster.goblin"]);
});

test("hydrate() rebuilds sessionSet from persisted session", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["spell.fireball", "monster.goblin"],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  const state = userStore.getState();
  ok(state.sessionSet instanceof Set);
  strictEqual(state.sessionSet.has("spell.fireball"), true);
  strictEqual(state.sessionSet.has("monster.goblin"), true);
});

test("hydrate() removes stale session IDs", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["nonexistent.entity"],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(userStore.getState().session, [], "stale session ID removed");
  strictEqual(userStore.getState().sessionSet.size, 0);
});

test("hydrate() removes duplicate session IDs from persistence", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["spell.fireball", "spell.fireball", "monster.goblin"],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(
    userStore.getState().session,
    ["spell.fireball", "monster.goblin"],
    "duplicate session IDs removed",
  );
});

test("hydrate() preserves valid session IDs and removes stale", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["spell.fireball", "nonexistent.entity", "monster.goblin"],
  };

  const fireball = getEntity("spell", "fireball");
  const goblin = getEntity("monster", "goblin");

  if (fireball && goblin) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    hydrate();
    deepStrictEqual(
      userStore.getState().session,
      ["spell.fireball", "monster.goblin"],
      "valid preserved, stale removed",
    );
  } else {
    hydrate();
    ok(true, "hydrate did not throw with mixed valid/invalid session IDs");
  }
});

// ---------------------------------------------------------------------------
// Session cross-tab
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 session cross-tab\n");

test("cross-tab session replace ignores identical state", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["spell.fireball"],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();

  const current = userStore.getState();
  const currentStr = JSON.stringify({
    version: current.version,
    favorites: current.favorites,
    recentEntities: current.recentEntities,
    recentSearches: current.recentSearches,
    session: current.session,
  });
  strictEqual(currentStr, JSON.stringify(data), "session serialization matches stored data");
});

test("_replace updates session when content differs", () => {
  resetMock();
  resetStore();
  userStore.getState()._replace({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["a", "b"],
    adventures: [],
    activeAdventureId: null,
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: "jade",
  });
  deepStrictEqual(userStore.getState().session, ["a", "b"]);
});

// ---------------------------------------------------------------------------
// Session selectors
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 session selectors\n");

test("useIsInSession returns true for session member", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleSession("spell.fireball");
  strictEqual(
    userStore.getState().sessionSet.has("spell.fireball"),
    true,
    "sessionSet O(1) lookup",
  );
});

test("useIsInSession returns false for non-member", () => {
  resetMock();
  resetStore();
  strictEqual(userStore.getState().sessionSet.has("nonexistent"), false);
});

test("sessionSet O(1) lookup works after hydrate", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: ["spell.fireball"],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  strictEqual(userStore.getState().sessionSet.has("spell.fireball"), true, "O(1) after hydrate");
});

test("useSessionIds returns all IDs when no limit", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleSession("a");
  s.toggleSession("b");
  const ids = userStore.getState().session;
  deepStrictEqual(ids, ["b", "a"]);
});

test("useSessionIds respects limit", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.toggleSession("a");
  s.toggleSession("b");
  s.toggleSession("c");
  s.toggleSession("d");
  const state = userStore.getState();
  deepStrictEqual(state.session.slice(0, 2), ["d", "c"]);
});

// ---------------------------------------------------------------------------
// Adventure
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 adventure\n");

test("adventure initial state is empty", () => {
  resetMock();
  resetStore();
  deepStrictEqual(userStore.getState().adventures, []);
  strictEqual(userStore.getState().activeAdventureId, null);
  ok(userStore.getState().adventureEntitySet instanceof Set);
  strictEqual(userStore.getState().adventureEntitySet.size, 0);
});

test("createAdventure creates a new adventure and sets it active", () => {
  resetMock();
  resetStore();
  userStore.getState().createAdventure({ title: "My Quest" });
  const state = userStore.getState();
  strictEqual(state.adventures.length, 1);
  strictEqual(state.adventures[0]!.title, "My Quest");
  strictEqual(state.activeAdventureId, state.adventures[0]!.id);
  ok(state.adventureEntitySet instanceof Set);
});

test("createAdventure with no title uses default", () => {
  resetMock();
  resetStore();
  userStore.getState().createAdventure();
  const state = userStore.getState();
  strictEqual(state.adventures.length, 1);
  strictEqual(state.adventures[0]!.title, "New Adventure");
});

test("toggleAdventureEntity auto-creates adventure when none active", () => {
  resetMock();
  resetStore();
  userStore.getState().toggleAdventureEntity("spell.fireball");
  const state = userStore.getState();
  strictEqual(state.adventures.length, 1);
  strictEqual(state.activeAdventureId, state.adventures[0]!.id);
  deepStrictEqual(state.adventures[0]!.entities, ["spell.fireball"]);
  ok(state.adventureEntitySet.has("spell.fireball"));
});

test("toggleAdventureEntity adds entity to active adventure", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  s.toggleAdventureEntity("spell.fireball");
  const state = userStore.getState();
  deepStrictEqual(state.adventures[0]!.entities, ["spell.fireball"]);
  ok(state.adventureEntitySet.has("spell.fireball"));
});

test("toggleAdventureEntity removes entity from active adventure", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  s.toggleAdventureEntity("spell.fireball");
  s.toggleAdventureEntity("spell.fireball");
  const state = userStore.getState();
  deepStrictEqual(state.adventures[0]!.entities, []);
  strictEqual(state.adventureEntitySet.size, 0);
});

test("toggleAdventureEntity adds multiple entities", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  s.toggleAdventureEntity("spell.fireball");
  s.toggleAdventureEntity("monster.goblin");
  const state = userStore.getState();
  deepStrictEqual(state.adventures[0]!.entities, ["spell.fireball", "monster.goblin"]);
  strictEqual(state.adventureEntitySet.size, 2);
});

test("adventureEntitySet O(1) lookup", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  s.toggleAdventureEntity("spell.fireball");
  const state = userStore.getState();
  strictEqual(state.adventureEntitySet.has("spell.fireball"), true);
  strictEqual(state.adventureEntitySet.has("nonexistent"), false);
});

test("clearAdventureEntities removes all entities from active adventure", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  s.toggleAdventureEntity("spell.fireball");
  s.toggleAdventureEntity("monster.goblin");
  s.clearAdventureEntities();
  const state = userStore.getState();
  deepStrictEqual(state.adventures[0]!.entities, []);
  strictEqual(state.adventureEntitySet.size, 0);
});

test("updateAdventure updates title, description, notes", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Old Title" });
  const id = userStore.getState().adventures[0]!.id;
  s.updateAdventure(id, { title: "New Title", description: "A description", notes: "Some notes" });
  const state = userStore.getState();
  strictEqual(state.adventures[0]!.title, "New Title");
  strictEqual(state.adventures[0]!.description, "A description");
  strictEqual(state.adventures[0]!.notes, "Some notes");
});

test("addObjective adds objective to adventure", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  const id = userStore.getState().adventures[0]!.id;
  s.addObjective(id, "Find the treasure");
  deepStrictEqual(userStore.getState().adventures[0]!.objectives, ["Find the treasure"]);
});

test("addObjective ignores empty string", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  const id = userStore.getState().adventures[0]!.id;
  s.addObjective(id, "");
  s.addObjective(id, "  ");
  deepStrictEqual(userStore.getState().adventures[0]!.objectives, []);
});

test("removeObjective removes objective at index", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  const id = userStore.getState().adventures[0]!.id;
  s.addObjective(id, "A");
  s.addObjective(id, "B");
  s.addObjective(id, "C");
  s.removeObjective(id, 1);
  deepStrictEqual(userStore.getState().adventures[0]!.objectives, ["A", "C"]);
});

test("archiveAdventure marks adventure as archived and clears active", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  const id = userStore.getState().adventures[0]!.id;
  s.archiveAdventure(id);
  const state = userStore.getState();
  strictEqual(state.adventures[0]!.archived, true);
  strictEqual(state.activeAdventureId, null);
  strictEqual(state.adventureEntitySet.size, 0);
});

test("restoreAdventure restores archived adventure", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  const id = userStore.getState().adventures[0]!.id;
  s.archiveAdventure(id);
  s.restoreAdventure(id);
  strictEqual(userStore.getState().adventures[0]!.archived, false);
  strictEqual(userStore.getState().activeAdventureId, null);
});

test("setActiveAdventure switches active adventure", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "First" });
  const firstId = userStore.getState().adventures[0]!.id;
  s.toggleAdventureEntity("spell.fireball");
  s.createAdventure({ title: "Second" });
  s.setActiveAdventure(firstId);
  const state = userStore.getState();
  strictEqual(state.activeAdventureId, firstId);
  ok(state.adventureEntitySet.has("spell.fireball"));
});

test("setActiveAdventure with null clears active", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  s.setActiveAdventure(null);
  strictEqual(userStore.getState().activeAdventureId, null);
  strictEqual(userStore.getState().adventureEntitySet.size, 0);
});

test("createAdventure persists to localStorage", () => {
  resetMock();
  resetStore();
  userStore.getState().createAdventure({ title: "Persisted" });
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    strictEqual(parsed.adventures.length, 1);
    strictEqual(parsed.adventures[0]!.title, "Persisted");
    ok(typeof parsed.activeAdventureId === "string");
  }
});

test("adventureSet rebuilt on _replace", () => {
  resetMock();
  resetStore();
  userStore.getState()._replace({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [
      {
        id: "adv-1",
        title: "Test",
        description: "",
        objectives: [],
        notes: "",
        entities: ["x", "y"],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        archived: false,
      },
    ],
    activeAdventureId: "adv-1",
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: "jade",
  });
  const state = userStore.getState();
  strictEqual(state.adventures.length, 1);
  strictEqual(state.activeAdventureId, "adv-1");
  ok(state.adventureEntitySet.has("x"));
  ok(state.adventureEntitySet.has("y"));
  strictEqual(state.adventureEntitySet.size, 2);
});

test("adventureSet cleared on _reset", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  s.toggleAdventureEntity("spell.fireball");
  userStore.getState()._reset();
  const state = userStore.getState();
  deepStrictEqual(state.adventures, []);
  strictEqual(state.activeAdventureId, null);
  strictEqual(state.adventureEntitySet.size, 0);
});

// ---------------------------------------------------------------------------
// Adventure normalization
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 adventure normalization\n");

test("normalize removes invalid adventure entries", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [null, { no_id: true }, { id: "" }] as unknown as Adventure[],
    activeAdventureId: null,
  });
  strictEqual(result.adventures.length, 0);
});

test("normalize trims adventure title and description", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [
      {
        id: "adv-1",
        title: "  My Quest  ",
        description: "  Desc  ",
        objectives: [],
        notes: "  Notes  ",
        entities: [],
        createdAt: 1000,
        updatedAt: 2000,
        archived: false,
      },
    ],
    activeAdventureId: null,
  });
  strictEqual(result.adventures[0]!.title, "My Quest");
  strictEqual(result.adventures[0]!.description, "Desc");
  strictEqual(result.adventures[0]!.notes, "Notes");
});

test("normalize deduplicates adventure objectives", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [
      {
        id: "adv-1",
        title: "Test",
        description: "",
        objectives: ["a", "a", "b", "c", "b"],
        notes: "",
        entities: [],
        createdAt: 1000,
        updatedAt: 2000,
        archived: false,
      },
    ],
    activeAdventureId: null,
  });
  deepStrictEqual(result.adventures[0]!.objectives, ["a", "b", "c"]);
});

test("normalize removes empty objective strings", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [
      {
        id: "adv-1",
        title: "Test",
        description: "",
        objectives: ["a", "", "b", "  "],
        notes: "",
        entities: [],
        createdAt: 1000,
        updatedAt: 2000,
        archived: false,
      },
    ],
    activeAdventureId: null,
  });
  deepStrictEqual(result.adventures[0]!.objectives, ["a", "b"]);
});

test("normalize removes stale entity IDs from adventures", () => {
  const raw = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [
      {
        id: "adv-1",
        title: "Test",
        description: "",
        objectives: [],
        notes: "",
        entities: ["spell.fireball", "nonexistent.entity"],
        createdAt: 1000,
        updatedAt: 2000,
        archived: false,
      },
    ],
    activeAdventureId: null,
  };
  const result = normalize(raw);
  deepStrictEqual(result.adventures[0]!.entities, ["spell.fireball"]);
});

test("normalize clears activeAdventureId if adventure was removed", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: "nonexistent",
  });
  strictEqual(result.activeAdventureId, null);
});

test("normalize clears activeCharacterId if character was removed", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    activeCharacterId: "nonexistent",
  });
  strictEqual(result.activeCharacterId, null);
});

test("normalize preserves activeCharacterId when the character exists", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        abilityScores: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        hitPoints: { current: 10, max: 10 },
        combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
        knownSpellCanonicalIds: [],
        weaponCanonicalIds: [],
        magicItemCanonicalIds: [],
        activeConditions: [],
      },
    ],
    activeCharacterId: "p1",
  });
  strictEqual(result.activeCharacterId, "p1");
});

test("normalize enforces max 20 adventures", () => {
  const many = [];
  for (let i = 0; i < 25; i++) {
    many.push({
      id: `adv-${i}`,
      title: `Adventure ${i}`,
      description: "",
      objectives: [],
      notes: "",
      entities: [],
      createdAt: 1000,
      updatedAt: 1000 + i,
      archived: false,
    });
  }
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: many,
    activeAdventureId: null,
  });
  strictEqual(result.adventures.length, 20);
  strictEqual(result.adventures[0]!.id, "adv-0");
  strictEqual(result.adventures[19]!.id, "adv-19");
});

// ---------------------------------------------------------------------------
// Adventure hydration
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 adventure hydration\n");

test("hydrate() loads adventures from persisted state", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [
      {
        id: "adv-1",
        title: "Saved Adventure",
        description: "Desc",
        objectives: ["Goal 1"],
        notes: "Notes here",
        entities: ["spell.fireball"],
        createdAt: 1000,
        updatedAt: 2000,
        archived: false,
      },
    ],
    activeAdventureId: "adv-1",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  const state = userStore.getState();
  strictEqual(state.adventures.length, 1);
  strictEqual(state.adventures[0]!.title, "Saved Adventure");
  strictEqual(state.activeAdventureId, "adv-1");
  strictEqual(state.adventureEntitySet.has("spell.fireball"), true);
});

test("hydrate() removes stale entity IDs from persisted adventures", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [
      {
        id: "adv-1",
        title: "Test",
        description: "",
        objectives: [],
        notes: "",
        entities: ["nonexistent.entity"],
        createdAt: 1000,
        updatedAt: 2000,
        archived: false,
      },
    ],
    activeAdventureId: "adv-1",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  const state = userStore.getState();
  deepStrictEqual(state.adventures[0]!.entities, []);
  strictEqual(state.adventureEntitySet.size, 0);
});

test("hydrate() with duplicate adventures removes duplicates via normalize", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [
      {
        id: "adv-1",
        title: "Test",
        description: "",
        objectives: ["a", "a", "b"],
        notes: "",
        entities: ["spell.fireball", "spell.fireball"],
        createdAt: 1000,
        updatedAt: 2000,
        archived: false,
      },
    ],
    activeAdventureId: "adv-1",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  const state = userStore.getState();
  deepStrictEqual(state.adventures[0]!.objectives, ["a", "b"], "duplicate objectives removed");
  deepStrictEqual(state.adventures[0]!.entities, ["spell.fireball"], "duplicate entities removed");
});

// ---------------------------------------------------------------------------
// Adventure cross-tab
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 adventure cross-tab\n");

test("_replace updates adventures when content differs", () => {
  resetMock();
  resetStore();
  userStore.getState()._replace({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [
      {
        id: "adv-1",
        title: "Cross Tab",
        description: "",
        objectives: [],
        notes: "",
        entities: ["spell.fireball"],
        createdAt: 1000,
        updatedAt: 2000,
        archived: false,
      },
    ],
    activeAdventureId: "adv-1",
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: "jade",
  });
  const state = userStore.getState();
  strictEqual(state.adventures.length, 1);
  strictEqual(state.activeAdventureId, "adv-1");
  ok(state.adventureEntitySet.has("spell.fireball"));
});

test("adventuresEqual prevents unnecessary _replace on identical state", () => {
  resetMock();
  resetStore();
  const state: UserState = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [
      {
        id: "adv-1",
        title: "Same",
        description: "",
        objectives: [],
        notes: "",
        entities: ["x"],
        createdAt: 1000,
        updatedAt: 2000,
        archived: false,
      },
    ],
    activeAdventureId: "adv-1",
    characters: [],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: "jade",
  };
  userStore.getState()._replace(state);
  userStore.getState()._replace(state);
  strictEqual(userStore.getState().adventures.length, 1);
});

// ---------------------------------------------------------------------------
// Adventure selectors
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 adventure selectors\n");

test("useIsInAdventure returns true for entity in active adventure", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  s.toggleAdventureEntity("spell.fireball");
  strictEqual(userStore.getState().adventureEntitySet.has("spell.fireball"), true);
  strictEqual(userStore.getState().adventureEntitySet.has("nonexistent"), false);
});

test("useActiveAdventure returns the active adventure", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Active One" });
  const state = userStore.getState();
  const active = state.adventures.find((a) => a.id === state.activeAdventureId);
  ok(active);
  strictEqual(active?.title, "Active One");
});

test("useActiveAdventure returns null when none active", () => {
  resetMock();
  resetStore();
  strictEqual(userStore.getState().activeAdventureId, null);
});

test("setActiveCharacter sets and clears the active character", () => {
  resetMock();
  resetStore();
  const id = userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  userStore.getState().setActiveCharacter(id);
  strictEqual(userStore.getState().activeCharacterId, id);
  userStore.getState().setActiveCharacter(null);
  strictEqual(userStore.getState().activeCharacterId, null);
});

test("setActiveCharacter persists to localStorage", () => {
  resetMock();
  resetStore();
  const id = userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  userStore.getState().setActiveCharacter(id);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    strictEqual(parsed.activeCharacterId, id);
  } else {
    strictEqual(userStore.getState().activeCharacterId, id);
  }
});

test("useActiveCharacter returns the active character", () => {
  resetMock();
  resetStore();
  const id = userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  userStore.getState().setActiveCharacter(id);
  strictEqual(userStore.getState().activeCharacterId, id);
});

test("useAdventureEntityIds returns entities for active adventure", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.createAdventure({ title: "Test" });
  s.toggleAdventureEntity("spell.fireball");
  s.toggleAdventureEntity("monster.goblin");
  const state = userStore.getState();
  const active = state.adventures.find((a) => a.id === state.activeAdventureId);
  ok(active);
  deepStrictEqual(active?.entities, ["spell.fireball", "monster.goblin"]);
});

// ---------------------------------------------------------------------------
// Character references
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 character references\n");

test("characters initial state is empty", () => {
  resetMock();
  resetStore();
  deepStrictEqual(userStore.getState().characters, []);
});

test("addCharacter adds a reference with defaults", () => {
  resetMock();
  resetStore();
  const id = userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: {
      armorClass: 10,
      initiativeModifier: 0,
      passivePerception: 10,
    },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  const state = userStore.getState();
  strictEqual(state.characters.length, 1);
  const character = state.characters[0]!;
  strictEqual(character.id, id);
  strictEqual(character.name, "Lyra");
  strictEqual(character.class, "Wizard");
  strictEqual(character.level, 5);
  strictEqual(character.subclass, undefined);
  deepStrictEqual(character.abilityScores, {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });
  deepStrictEqual(character.hitPoints, { current: 10, max: 10 });
  deepStrictEqual(character.combatValues, {
    armorClass: 10,
    initiativeModifier: 0,
    passivePerception: 10,
    spellSaveDc: undefined,
    spellAttackBonus: undefined,
  });
  deepStrictEqual(character.knownSpellCanonicalIds, []);
  deepStrictEqual(character.weaponCanonicalIds, []);
  deepStrictEqual(character.magicItemCanonicalIds, []);
  strictEqual(character.note, undefined);
  ok(character.id.length > 0);
});

test("addCharacter trims name and class", () => {
  resetMock();
  resetStore();
  userStore.getState().addCharacter({
    name: "  Lyra  ",
    class: "  Wizard ",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  const character = userStore.getState().characters[0]!;
  strictEqual(character.name, "Lyra");
  strictEqual(character.class, "Wizard");
});

test("addCharacter clamps level and combat values", () => {
  resetMock();
  resetStore();
  userStore.getState().addCharacter({
    name: "Low",
    class: "Cleric",
    level: 0,
    abilityScores: {
      strength: -99,
      dexterity: 99,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 20000, max: 5000 },
    combatValues: {
      armorClass: 99,
      initiativeModifier: -99,
      passivePerception: -3,
      spellSaveDc: 99,
      spellAttackBonus: -99,
    },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  userStore.getState().addCharacter({
    name: "High",
    class: "Cleric",
    level: 99,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  const characters = userStore.getState().characters;
  strictEqual(characters[0]!.level, 1);
  strictEqual(characters[1]!.level, 20);
  strictEqual(characters[0]!.abilityScores.strength, 1);
  strictEqual(characters[0]!.abilityScores.dexterity, 30);
  strictEqual(characters[0]!.combatValues.armorClass, 40);
  strictEqual(characters[0]!.combatValues.initiativeModifier, -5);
  strictEqual(characters[0]!.combatValues.passivePerception, 0);
  strictEqual(characters[0]!.combatValues.spellSaveDc, 40);
  strictEqual(characters[0]!.combatValues.spellAttackBonus, -5);
  strictEqual(characters[0]!.hitPoints.current, 5000);
  strictEqual(characters[0]!.hitPoints.max, 5000);
  strictEqual(characters[1]!.hitPoints.current, 10);
  strictEqual(characters[1]!.hitPoints.max, 10);
});

test("addCharacter accepts references and note", () => {
  resetMock();
  resetStore();
  userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    subclass: "Evocation",
    abilityScores: {
      strength: 12,
      dexterity: 14,
      constitution: 16,
      intelligence: 18,
      wisdom: 20,
      charisma: 22,
    },
    hitPoints: { current: 35, max: 40 },
    combatValues: {
      armorClass: 15,
      initiativeModifier: 3,
      passivePerception: 17,
      spellSaveDc: 16,
      spellAttackBonus: 8,
    },
    knownSpellCanonicalIds: ["spell.fireball"],
    weaponCanonicalIds: ["equipment.longsword"],
    magicItemCanonicalIds: ["magicitem.wand-of-magic-missiles"],
    activeConditions: [],
    note: "Guild wizard",
  });
  const character = userStore.getState().characters[0]!;
  strictEqual(character.subclass, "Evocation");
  deepStrictEqual(character.abilityScores, {
    strength: 12,
    dexterity: 14,
    constitution: 16,
    intelligence: 18,
    wisdom: 20,
    charisma: 22,
  });
  deepStrictEqual(character.hitPoints, { current: 35, max: 40 });
  deepStrictEqual(character.combatValues, {
    armorClass: 15,
    initiativeModifier: 3,
    passivePerception: 17,
    spellSaveDc: 16,
    spellAttackBonus: 8,
  });
  deepStrictEqual(character.knownSpellCanonicalIds, ["spell.fireball"]);
  deepStrictEqual(character.weaponCanonicalIds, ["equipment.longsword"]);
  deepStrictEqual(character.magicItemCanonicalIds, ["magicitem.wand-of-magic-missiles"]);
  strictEqual(character.note, "Guild wizard");
});

test("addCharacter trims optional strings and keeps empty as undefined", () => {
  resetMock();
  resetStore();
  userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
    subclass: "  ",
    note: "",
  });
  const character = userStore.getState().characters[0]!;
  strictEqual(character.subclass, undefined);
  strictEqual(character.note, undefined);
});

test("addCharacter persists to localStorage", () => {
  resetMock();
  resetStore();
  userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    ok(parsed.characters.length === 1, "characters persisted");
  } else {
    ok(userStore.getState().characters.length === 1);
  }
});

test("updateCharacter updates fields", () => {
  resetMock();
  resetStore();
  userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  const id = userStore.getState().characters[0]!.id;
  userStore.getState().updateCharacter(id, {
    level: 6,
    subclass: "Evocation",
    note: "New note",
    knownSpellCanonicalIds: ["spell.fireball"],
    combatValues: { spellSaveDc: 16 },
  });
  const character = userStore.getState().characters[0]!;
  strictEqual(character.level, 6);
  strictEqual(character.subclass, "Evocation");
  strictEqual(character.note, "New note");
  deepStrictEqual(character.knownSpellCanonicalIds, ["spell.fireball"]);
  strictEqual(character.combatValues.spellSaveDc, 16);
  strictEqual(character.name, "Lyra");
  strictEqual(character.combatValues.armorClass, 10);
});

test("updateCharacter clamps level", () => {
  resetMock();
  resetStore();
  userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  const id = userStore.getState().characters[0]!.id;
  userStore.getState().updateCharacter(id, { level: 99 });
  strictEqual(userStore.getState().characters[0]!.level, 20);
});

test("updateCharacter converts empty strings to undefined", () => {
  resetMock();
  resetStore();
  userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
    subclass: "Evocation",
    note: "Keep notes",
  });
  const id = userStore.getState().characters[0]!.id;
  userStore.getState().updateCharacter(id, { subclass: "  ", note: "" });
  const character = userStore.getState().characters[0]!;
  strictEqual(character.subclass, undefined);
  strictEqual(character.note, undefined);
});

test("updateCharacter is a no-op for unknown id", () => {
  resetMock();
  resetStore();
  userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  userStore.getState().updateCharacter("nonexistent", { name: "Changed" });
  strictEqual(userStore.getState().characters[0]!.name, "Lyra");
});

test("removeCharacter removes by id", () => {
  resetMock();
  resetStore();
  userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  const id = userStore.getState().characters[0]!.id;
  userStore.getState().removeCharacter(id);
  deepStrictEqual(userStore.getState().characters, []);
});

test("removeCharacter clears activeCharacterId when active is removed", () => {
  resetMock();
  resetStore();
  userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  const id = userStore.getState().characters[0]!.id;
  userStore.getState().setActiveCharacter(id);
  strictEqual(userStore.getState().activeCharacterId, id);
  userStore.getState().removeCharacter(id);
  strictEqual(userStore.getState().activeCharacterId, null);
});

test("_replace updates characters when content differs", () => {
  resetMock();
  resetStore();
  userStore.getState()._replace({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    adventures: [],
    activeAdventureId: null,
    characters: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        abilityScores: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        hitPoints: { current: 10, max: 10 },
        combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
        knownSpellCanonicalIds: [],
        weaponCanonicalIds: [],
        magicItemCanonicalIds: [],
        activeConditions: [],
      },
    ],
    activeCharacterId: null,
    beginnerMode: true,
    onboardingComplete: false,
    theme: "jade",
  });
  const state = userStore.getState();
  strictEqual(state.characters.length, 1);
  strictEqual(state.characters[0]?.name, "Lyra");
});

test("characters cleared on _reset", () => {
  resetMock();
  resetStore();
  const s = userStore.getState();
  s.addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
  });
  userStore.getState()._reset();
  deepStrictEqual(userStore.getState().characters, []);
});

// ---------------------------------------------------------------------------
// Character reference normalization
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 character reference normalization\n");

test("normalize drops invalid character references", () => {
  const characters = [
    null,
    "bad",
    {
      id: "p1",
      name: "Lyra",
      class: "Wizard",
      level: 5,
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      hitPoints: { current: 10, max: 10 },
      combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
      knownSpellCanonicalIds: [],
      weaponCanonicalIds: [],
      magicItemCanonicalIds: [],
    },
    { id: "", name: "NoId", class: "Cleric", level: 5 },
    { id: "p2", name: "  ", class: "Fighter", level: 3 },
  ] as unknown as CharacterReference[];
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters,
  });
  strictEqual(result.characters.length, 1);
  strictEqual(result.characters[0]?.id, "p1");
});

test("normalize trims name and class", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      { id: "p1", name: "  Lyra  ", class: " Wizard ", level: 5 },
    ] as unknown as CharacterReference[],
  });
  strictEqual(result.characters[0]?.name, "Lyra");
  strictEqual(result.characters[0]?.class, "Wizard");
});

test("normalize clamps character reference level and fills defaults", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      { id: "p1", name: "Low", class: "Cleric", level: 0 },
      { id: "p2", name: "High", class: "Cleric", level: 99 },
    ] as unknown as CharacterReference[],
  });
  strictEqual(result.characters[0]?.level, 1);
  strictEqual(result.characters[1]?.level, 20);
  const character = result.characters[0]!;
  deepStrictEqual(character.abilityScores, {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });
  deepStrictEqual(character.hitPoints, { current: 10, max: 10 });
  deepStrictEqual(character.combatValues, {
    armorClass: 10,
    initiativeModifier: 0,
    passivePerception: 10,
    spellSaveDc: undefined,
    spellAttackBonus: undefined,
  });
});

test("normalize clamps ability scores and combat values", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        abilityScores: {
          strength: -99,
          dexterity: 99,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        hitPoints: { current: 20000, max: 5000 },
        combatValues: {
          armorClass: 99,
          initiativeModifier: -99,
          passivePerception: -3,
          spellSaveDc: 99,
          spellAttackBonus: -99,
        },
        knownSpellCanonicalIds: [],
        weaponCanonicalIds: [],
        magicItemCanonicalIds: [],
        activeConditions: [],
      },
    ],
  });
  const character = result.characters[0]!;
  strictEqual(character.abilityScores.strength, 1);
  strictEqual(character.abilityScores.dexterity, 30);
  strictEqual(character.hitPoints.current, 5000);
  strictEqual(character.hitPoints.max, 5000);
  strictEqual(character.combatValues.armorClass, 40);
  strictEqual(character.combatValues.initiativeModifier, -5);
  strictEqual(character.combatValues.passivePerception, 0);
  strictEqual(character.combatValues.spellSaveDc, 40);
  strictEqual(character.combatValues.spellAttackBonus, -5);
});

test("normalize derives scores from legacy abilityModifiers", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        abilityModifiers: {
          strength: -5,
          dexterity: 10,
          constitution: 0,
          intelligence: 3,
          wisdom: 0,
          charisma: 0,
        },
        combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
        knownSpellCanonicalIds: [],
        weaponCanonicalIds: [],
        magicItemCanonicalIds: [],
      },
    ] as unknown as CharacterReference[],
  });
  const character = result.characters[0]!;
  deepStrictEqual(character.abilityScores, {
    strength: 1,
    dexterity: 30,
    constitution: 10,
    intelligence: 16,
    wisdom: 10,
    charisma: 10,
  });
  deepStrictEqual(character.hitPoints, { current: 10, max: 10 });
});

test("normalize removes stale reference IDs from character references", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        knownSpellCanonicalIds: ["spell.fireball", "nonexistent.entity"],
        weaponCanonicalIds: ["equipment.longsword", "nonexistent.weapon"],
        magicItemCanonicalIds: ["magicitem.wand-of-magic-missiles", "nonexistent.item"],
      },
    ] as unknown as CharacterReference[],
  });
  const character = result.characters[0]!;
  deepStrictEqual(character.knownSpellCanonicalIds, ["spell.fireball"]);
  deepStrictEqual(character.weaponCanonicalIds, ["equipment.longsword"]);
  deepStrictEqual(character.magicItemCanonicalIds, ["magicitem.wand-of-magic-missiles"]);
});

test("normalize defaults activeConditions to [] and strips unknown condition IDs", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        activeConditions: ["condition.prone", "nonexistent.condition", "condition.prone"],
      },
    ] as unknown as CharacterReference[],
  });
  const character = result.characters[0]!;
  deepStrictEqual(character.activeConditions, ["condition.prone"]);
});

test("characters without activeConditions get an empty list", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
      },
    ] as unknown as CharacterReference[],
  });
  deepStrictEqual(result.characters[0]?.activeConditions, []);
});

test("activeConditions survive a hydrate round-trip", () => {
  resetMock();
  resetStore();
  const id = userStore.getState().addCharacter({
    name: "Lyra",
    class: "Wizard",
    level: 5,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    activeConditions: [],
    note: undefined,
  });
  userStore
    .getState()
    .updateCharacter(id, { activeConditions: ["condition.blinded", "condition.stunned"] });
  deepStrictEqual(userStore.getState().characters[0]?.activeConditions, [
    "condition.blinded",
    "condition.stunned",
  ]);
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      {
        id,
        name: "Lyra",
        class: "Wizard",
        level: 5,
        abilityScores: {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
        },
        hitPoints: { current: 10, max: 10 },
        combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
        knownSpellCanonicalIds: [],
        weaponCanonicalIds: [],
        magicItemCanonicalIds: [],
        activeConditions: ["condition.blinded"],
      },
    ],
    activeCharacterId: id,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(userStore.getState().characters[0]?.activeConditions, ["condition.blinded"]);
});

test("normalize converts empty optional strings to undefined and truncates note", () => {
  const longNote = "x".repeat(300);
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        subclass: "  ",
        note: `  ${longNote}  `,
      },
    ] as unknown as CharacterReference[],
  });
  const character = result.characters[0]!;
  strictEqual(character.subclass, undefined);
  strictEqual(character.note?.length, 280);
});

test("normalize caps characters at 12", () => {
  const characters = Array.from({ length: 15 }, (_, i) => ({
    id: `p${i}`,
    name: `Character ${i}`,
    class: "Fighter",
    level: 1,
  }));
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: characters as unknown as CharacterReference[],
  });
  strictEqual(result.characters.length, 12);
});

test("normalize caps character reference lists", () => {
  const distinct = (items: readonly { canonicalId: string }[], max: number): string[] => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of items) {
      if (seen.has(item.canonicalId)) continue;
      seen.add(item.canonicalId);
      result.push(item.canonicalId);
      if (result.length === max) break;
    }
    return result;
  };
  const spellIds = distinct(getSpells(), 51);
  const weaponIds = distinct(
    getEquipmentList().filter((e) => e.type === "Melee Weapon" || e.type === "Ranged Weapon"),
    11,
  );
  const magicItemIds = distinct(getMagicItems(), 31);
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        knownSpellCanonicalIds: spellIds,
        weaponCanonicalIds: weaponIds,
        magicItemCanonicalIds: magicItemIds,
      },
    ] as unknown as CharacterReference[],
  });
  const character = result.characters[0]!;
  strictEqual(character.knownSpellCanonicalIds.length, 50);
  strictEqual(character.weaponCanonicalIds.length, 10);
  strictEqual(character.magicItemCanonicalIds.length, 30);
});

test("normalize handles non-array characters gracefully", () => {
  const result = normalize({
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: "not-an-array" as unknown as CharacterReference[],
  });
  deepStrictEqual(result.characters, []);
});

// ---------------------------------------------------------------------------
// Character reference hydration
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 character reference hydration\n");

test("hydrate() loads characters from persisted state", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        knownSpellCanonicalIds: ["spell.fireball"],
        weaponCanonicalIds: ["equipment.longsword"],
        magicItemCanonicalIds: [],
      },
    ],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  const state = userStore.getState();
  strictEqual(state.characters.length, 1);
  strictEqual(state.characters[0]?.name, "Lyra");
  deepStrictEqual(state.characters[0]?.knownSpellCanonicalIds, ["spell.fireball"]);
});

test("hydrate() removes stale reference IDs from persisted characters", () => {
  resetMock();
  resetStore();
  const data = {
    version: CURRENT_VERSION,
    favorites: [],
    recentEntities: [],
    recentSearches: [],
    session: [],
    characters: [
      {
        id: "p1",
        name: "Lyra",
        class: "Wizard",
        level: 5,
        knownSpellCanonicalIds: ["spell.fireball", "nonexistent.entity"],
        weaponCanonicalIds: [],
        magicItemCanonicalIds: [],
      },
    ],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  const state = userStore.getState();
  deepStrictEqual(state.characters[0]?.knownSpellCanonicalIds, ["spell.fireball"]);
});

console.log(
  "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
);
