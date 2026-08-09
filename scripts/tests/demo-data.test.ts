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
// localStorage mock (mirrors user-state.test.ts)
// ---------------------------------------------------------------------------
const store = new Map<string, string>();

(globalThis as Record<string, unknown>).localStorage = {
  getItem(key: string): string | null {
    return store.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    store.set(key, value);
  },
  removeItem(key: string): void {
    store.delete(key);
  },
  clear(): void {
    store.clear();
  },
  get length() {
    return store.size;
  },
  key(_index: number): string | null {
    return null;
  },
};

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------
const { loadCompendium } = await import("../../src/compendium/loader");
const { userStore } = await import("../../src/user-state/store");
const { validateIds } = await import("../../src/user-state/normalize");
const { seedDemoData, DEMO_CHARACTER } = await import("../../src/features/demo/demo-data");

console.log("demo data seeding\n");

await loadCompendium();

const ALL_DEMO_IDS = [
  ...DEMO_CHARACTER.knownSpellCanonicalIds,
  ...DEMO_CHARACTER.weaponCanonicalIds,
  ...DEMO_CHARACTER.magicItemCanonicalIds,
  ...DEMO_CHARACTER.activeConditions,
  "spell.fireball",
  "monster.goblin",
  "monster.owlbear",
  "equipment.longsword",
];

test("every demo canonical ID is registered in the compendium", () => {
  const unique = [...new Set(ALL_DEMO_IDS)];
  deepStrictEqual(validateIds(unique), unique);
});

test("seedDemoData creates a realistic character and session context", () => {
  userStore.getState()._reset();
  seedDemoData();

  const state = userStore.getState();

  strictEqual(state.characters.length, 1);
  const character = state.characters[0]!;
  strictEqual(character.name, DEMO_CHARACTER.name);
  strictEqual(character.class, "Wizard");
  strictEqual(character.level, 5);
  ok(character.subclass !== undefined);
  strictEqual(state.activeCharacterId, character.id);

  // Realistic ability spread, not all 10s.
  ok(character.abilityScores.intelligence >= 15);
  ok(character.abilityScores.strength <= 10);

  // Mid-fight HP: not full, not empty.
  ok(character.hitPoints.current > 0);
  ok(character.hitPoints.current < character.hitPoints.max);

  // Spells, a weapon, a magic item, and one active condition.
  ok(character.knownSpellCanonicalIds.length >= 3);
  ok(character.weaponCanonicalIds.length >= 1);
  ok(character.magicItemCanonicalIds.length >= 1);
  strictEqual(character.activeConditions.length, 1);

  // Pre-populated recents, a live session, and onboarding marked complete.
  ok(state.recentEntities.length >= 2);
  ok(state.session.length >= 1);
  strictEqual(state.onboardingComplete, true);
});

test("seedDemoData preserves any existing characters", () => {
  userStore.getState()._reset();
  userStore.getState().addCharacter(DEMO_CHARACTER);
  const before = userStore.getState().characters.length;
  seedDemoData();
  const state = userStore.getState();
  strictEqual(state.characters.length, before + 1);
  strictEqual(state.activeCharacterId, state.characters[state.characters.length - 1]!.id);
});
