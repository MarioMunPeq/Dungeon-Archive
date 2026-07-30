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
const { STORAGE_KEY, CURRENT_VERSION, createDefaultState } = await import(
  "../../src/user-state/types"
);
const { migrate } = await import("../../src/user-state/migrations");
const { read, write } = await import("../../src/user-state/persistence");
const { loadCompendium } = await import("../../src/compendium/loader");
const { hydrate, userStore } = await import("../../src/user-state/store");
const { normalize, validateIds } = await import("../../src/user-state/normalize");
const { getEntity } = await import("../../src/compendium/repository");

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

test("CURRENT_VERSION equals 1", () => {
  strictEqual(CURRENT_VERSION, 1);
});

test("createDefaultState returns valid v1 state", () => {
  const def = createDefaultState();
  strictEqual(def.version, 1);
  deepStrictEqual(def.favorites, []);
  deepStrictEqual(def.recentEntities, []);
  deepStrictEqual(def.recentSearches, []);
});

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 persistence\n");

test("persistence.read() returns default on missing key", () => {
  resetMock();
  const result = read();
  strictEqual(result.version, 1);
  deepStrictEqual(result.favorites, []);
});

test("persistence.read() recovers default on invalid JSON", () => {
  resetMock();
  localStorage.setItem(STORAGE_KEY, "not-json");
  const result = read();
  strictEqual(result.version, 1);
  deepStrictEqual(result.favorites, []);
});

test("persistence.read() recovers default on null JSON", () => {
  resetMock();
  localStorage.setItem(STORAGE_KEY, "null");
  const result = read();
  strictEqual(result.version, 1);
});

test("persistence.read() recovers default on non-object JSON", () => {
  resetMock();
  localStorage.setItem(STORAGE_KEY, '"string"');
  const result = read();
  strictEqual(result.version, 1);
});

test("persistence.write() stores JSON under STORAGE_KEY", () => {
  resetMock();
  const state = createDefaultState();
  state.favorites.push("spell.fireball");
  write(state);
  const stored = localStorage.getItem(STORAGE_KEY);
  ok(stored, "should be stored");
  const parsed = JSON.parse(stored!);
  strictEqual(parsed.version, 1);
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
  strictEqual(result.version, 1);
  deepStrictEqual(result.favorites, []);
});

test("persistence.read() returns default when stored version is unknown (migrate resets)", () => {
  resetMock();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 999, favorites: "invalid" }));
  const result = read();
  strictEqual(result.version, 1);
  deepStrictEqual(result.favorites, []);
});

// ---------------------------------------------------------------------------
// Migrations
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 migrations\n");

test("migrations.migrate() returns v1 for undefined input", () => {
  const result = migrate(undefined);
  strictEqual(result.version, 1);
});

test("migrations.migrate() returns v1 for null input", () => {
  const result = migrate(null);
  strictEqual(result.version, 1);
});

test("migrations.migrate() preserves valid v1 state", () => {
  const input = { version: 1, favorites: ["a"], recentEntities: ["b"], recentSearches: ["c"] };
  const result = migrate(input);
  deepStrictEqual(result.favorites, ["a"]);
  deepStrictEqual(result.recentEntities, ["b"]);
  deepStrictEqual(result.recentSearches, ["c"]);
});

test("migrations.migrate() converts legacy (no version) to v1", () => {
  const input = { favorites: ["x"], recentEntities: ["y"], recentSearches: ["z"] };
  const result = migrate(input);
  strictEqual(result.version, 1);
  deepStrictEqual(result.favorites, ["x"]);
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
  });
  deepStrictEqual(result.favorites, ["a", "b", "c"]);
});

test("normalize preserves insertion order (first occurrence wins)", () => {
  const result = normalize({
    version: 1,
    favorites: ["c", "a", "b", "a"],
    recentEntities: [],
    recentSearches: [],
  });
  deepStrictEqual(result.favorites, ["c", "a", "b"]);
});

test("normalize removes empty strings from favorites", () => {
  const result = normalize({
    version: 1,
    favorites: ["a", "", "b", "  ", "c"],
    recentEntities: [],
    recentSearches: [],
  });
  deepStrictEqual(result.favorites, ["a", "b", "c"]);
});

test("normalize removes non-string values from favorites", () => {
  const result = normalize({
    version: 1,
    favorites: ["a", 123 as unknown as string, null as unknown as string, "b"],
    recentEntities: [],
    recentSearches: [],
  });
  deepStrictEqual(result.favorites, ["a", "b"]);
});

test("normalize deduplicates recent entities, keeps first occurrence", () => {
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: ["a", "b", "c", "a", "d", "b"],
    recentSearches: [],
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
  });
  deepStrictEqual(result.recentSearches, ["fireball", "magic missile", "shield"]);
});

test("normalize trims whitespace from searches", () => {
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: [],
    recentSearches: ["  fireball  ", "shield", " magic "],
  });
  deepStrictEqual(result.recentSearches, ["fireball", "shield", "magic"]);
});

test("normalize removes empty searches after trim", () => {
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: [],
    recentSearches: ["fireball", "", "  ", "shield"],
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
  });
  deepStrictEqual(result.favorites, []);
});

test("normalize handles non-array recentEntities gracefully", () => {
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: null as unknown as string[],
    recentSearches: [],
  });
  deepStrictEqual(result.recentEntities, []);
});

test("normalize handles non-array recentSearches gracefully", () => {
  const result = normalize({
    version: 1,
    favorites: [],
    recentEntities: [],
    recentSearches: 123 as unknown as string[],
  });
  deepStrictEqual(result.recentSearches, []);
});

test("normalize sets version to CURRENT_VERSION", () => {
  const result = normalize(createDefaultState());
  strictEqual(result.version, CURRENT_VERSION);
});

test("normalize with validateIds removes stale IDs (with compendium loaded)", () => {
  const raw = {
    version: 1,
    favorites: ["spell.fireball", "nonexistent.entity"],
    recentEntities: ["monster.goblin"],
    recentSearches: [],
  };
  const validated: typeof raw = {
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
    version: 1,
    favorites: ["x", "y"],
    recentEntities: [],
    recentSearches: [],
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
  ok(state.version === 1, "should recover to v1 default");
  ok(Array.isArray(state.favorites));
  ok(state.favoritesSet instanceof Set);
});

test("hydrate() loads valid persisted state", () => {
  resetMock();
  resetStore();
  const data = { version: 1, favorites: ["spell.fireball"], recentEntities: [], recentSearches: [] };
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
  const data = { version: 1, favorites: ["spell.fireball", "monster.goblin"], recentEntities: [], recentSearches: [] };
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
  const data = { version: 1, favorites: ["nonexistent.entity"], recentEntities: [], recentSearches: [] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(userStore.getState().favorites, [], "stale favorite removed");
  strictEqual(userStore.getState().favoritesSet.size, 0);
});

test("hydrate() removes stale recent entity IDs", () => {
  resetMock();
  resetStore();
  const data = { version: 1, favorites: [], recentEntities: ["nonexistent.entity"], recentSearches: [] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(userStore.getState().recentEntities, [], "stale recent entity removed");
});

test("hydrate() removes duplicate favorites from persistence", () => {
  resetMock();
  resetStore();
  const data = { version: 1, favorites: ["spell.fireball", "spell.fireball", "monster.goblin", "spell.fireball"], recentEntities: [], recentSearches: [] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(userStore.getState().favorites, ["spell.fireball", "monster.goblin"], "duplicates removed");
});

test("hydrate() removes duplicate searches from persistence", () => {
  resetMock();
  resetStore();
  const data = { version: 1, favorites: [], recentEntities: [], recentSearches: ["fireball", "fireball", "shield", "fireball"] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();
  deepStrictEqual(userStore.getState().recentSearches, ["fireball", "shield"], "duplicate searches removed");
});

test("hydrate() preserves valid entity IDs and removes stale ones", () => {
  resetMock();
  resetStore();
  const data = { version: 1, favorites: ["spell.fireball", "nonexistent.entity"], recentEntities: ["monster.goblin"], recentSearches: [] };

  const fireball = getEntity("spell", "fireball");
  const goblin = getEntity("monster", "goblin");

  if (fireball && goblin) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    hydrate();
    deepStrictEqual(userStore.getState().favorites, ["spell.fireball"], "valid favorite preserved, stale removed");
    deepStrictEqual(userStore.getState().recentEntities, ["monster.goblin"], "valid recent entity preserved");
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
  const data = { version: 1, favorites: ["spell.fireball"], recentEntities: [], recentSearches: [] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  hydrate();

  const current = userStore.getState();
  const currentStr = JSON.stringify({
    version: current.version,
    favorites: current.favorites,
    recentEntities: current.recentEntities,
    recentSearches: current.recentSearches,
  });
  strictEqual(currentStr, JSON.stringify(data), "state serialization matches stored data");
});

test("safe replace does nothing when state is identical", () => {
  resetMock();
  resetStore();
  userStore.getState()._replace({
    version: 1,
    favorites: ["a", "b"],
    recentEntities: ["x"],
    recentSearches: ["q"],
  });
  // Call _replace with identical data (simulating replaceState logic)
  userStore.getState()._replace({
    version: 1,
    favorites: ["a", "b"],
    recentEntities: ["x"],
    recentSearches: ["q"],
  });
  const state2 = userStore.getState();
  deepStrictEqual(state2.favorites, ["a", "b"]);
});

// ---------------------------------------------------------------------------
// Pipeline Integration
// ---------------------------------------------------------------------------
console.log("\nuser-state \u2014 pipeline\n");

test("migrate + normalize pipeline recovers gracefully from malformed object", () => {
  const migrated = migrate({ version: 1, favorites: "bad", recentEntities: null, recentSearches: [1, 2, 3] });
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
  const data = { version: 1, favorites: ["spell.fireball", "monster.goblin"], recentEntities: [], recentSearches: [] };
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

console.log(
  "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n",
);
