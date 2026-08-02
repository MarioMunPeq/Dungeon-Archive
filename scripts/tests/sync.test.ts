import { strictEqual, ok, deepStrictEqual } from "node:assert";

async function test(description: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  \u2713 ${description}`);
  } catch (e) {
    console.error(`  \u2717 ${description}`);
    console.error(`    ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

async function assertRejects(fn: () => Promise<unknown>, pattern: RegExp): Promise<void> {
  try {
    await fn();
  } catch (e) {
    const message = (e as Error).message;
    if (pattern.test(message)) return;
    throw new Error(`rejected with unexpected message: ${message}`);
  }
  throw new Error("expected promise to reject");
}

// ---------------------------------------------------------------------------
// localStorage mock (write() in restore persists here)
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
// Imports (after the mock is installed; sync uses the fake gateway under tsx
// because hasCloudConfig() is false without a Vite build).
// ---------------------------------------------------------------------------
const { upload, restore, getGateway } = await import("../../src/sync/index");
const { userStore } = await import("../../src/user-state/store");

function resetStore(): void {
  userStore.getState()._reset();
}

async function signIn(): Promise<void> {
  const gateway = await getGateway();
  await gateway.signIn();
}

async function signOut(): Promise<void> {
  const gateway = await getGateway();
  await gateway.signOut();
}

await test("upload rejects when not signed in", async () => {
  await signOut();
  await assertRejects(upload, /Not signed in/);
});

await test("restore rejects when not signed in", async () => {
  await signOut();
  await assertRejects(restore, /Not signed in/);
});

await test("restore rejects when no cloud backup exists", async () => {
  await signIn();
  await assertRejects(restore, /No cloud backup found/);
});

await test("upload then restore round-trips local state", async () => {
  resetStore();
  userStore.getState().toggleFavorite("test-entity");
  userStore.getState().addRecentSearch("  fireball  ");

  await upload();

  const gateway = await getGateway();
  const user = gateway.getCurrentUser();
  ok(user !== null, "should be signed in");
  const snapshot = await gateway.fetchSnapshot(user.uid);
  ok(snapshot !== null, "snapshot should exist after upload");
  deepStrictEqual(snapshot.state.favorites, ["test-entity"]);
  deepStrictEqual(snapshot.state.recentSearches, ["fireball"]);

  resetStore();
  strictEqual(userStore.getState().favorites.length, 0, "local state cleared before restore");

  await restore();

  deepStrictEqual(userStore.getState().favorites, ["test-entity"]);
  deepStrictEqual(userStore.getState().recentSearches, ["fireball"]);
  strictEqual(userStore.getState().favoritesSet.has("test-entity"), true);
  strictEqual(userStore.getState()._hasHydrated, false, "restore does not flip hydration flag");
});
