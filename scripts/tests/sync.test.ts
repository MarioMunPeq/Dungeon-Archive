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
const {
  upload,
  restore,
  getGateway,
  getBackupStatus,
  computeMetadata,
  friendlyErrorMessage,
} = await import("../../src/sync/index");
const { userStore } = await import("../../src/user-state/store");
import type { CloudSnapshot } from "../../src/sync/types";

function resetStore(): void {
  userStore.getState()._reset();
  store.clear();
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
  const snapshot = await gateway.fetchSnapshot();
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

await test("upload stores metadata, updatedAt and appVersion", async () => {
  resetStore();
  const state = userStore.getState();
  userStore.getState().toggleFavorite("meta-a");
  userStore.getState().toggleSession("meta-sess");
  const now = Date.now();

  await upload();

  const gateway = await getGateway();
  const snapshot = await gateway.fetchSnapshot();
  ok(snapshot !== null, "snapshot should exist after upload");
  ok(snapshot.updatedAt >= now, "updatedAt is set");
  ok(snapshot.appVersion.length > 0, "appVersion is set");
  strictEqual(snapshot.metadata.adventureCount, state.adventures.length);
  strictEqual(snapshot.metadata.playerCount, state.players.length);
  strictEqual(snapshot.metadata.favoriteCount, 1);
  strictEqual(snapshot.metadata.sessionCount, 1);
  strictEqual(snapshot.metadata.activeAdventureTitle, null);
});

await test("computeMetadata counts adventures, players, favorites and sessions", () => {
  const base = userStore.getState();
  const meta = computeMetadata(
    {
      ...base,
      adventures: [
        {
          id: "adv-1",
          title: "Curse of Strahd",
          description: "",
          objectives: [],
          notes: "",
          entities: [],
          createdAt: 0,
          updatedAt: 0,
          archived: false,
        },
      ],
      activeAdventureId: "adv-1",
      players: [
        {
          id: "p-1",
          name: "Luna",
          class: "Wizard",
          level: 3,
          abilityModifiers: {
            strength: 0,
            dexterity: 1,
            constitution: 0,
            intelligence: 3,
            wisdom: 1,
            charisma: 0,
          },
          combatValues: {
            armorClass: 12,
            initiativeModifier: 1,
            passivePerception: 12,
          },
          knownSpellCanonicalIds: [],
          weaponCanonicalIds: [],
          magicItemCanonicalIds: [],
        },
      ],
      favorites: ["fav-a", "fav-b", "fav-c"],
      session: ["sess-a", "sess-b"],
    },
    1234,
  );
  strictEqual(meta.adventureCount, 1);
  strictEqual(meta.playerCount, 1);
  strictEqual(meta.favoriteCount, 3);
  strictEqual(meta.sessionCount, 2);
  strictEqual(meta.activeAdventureTitle, "Curse of Strahd");
  strictEqual(meta.createdAt, 1234);
});

await test("last upload is persisted and reported as up to date", async () => {
  resetStore();
  userStore.getState().toggleFavorite("status-a");
  await upload();

  const gateway = await getGateway();
  const user = gateway.getCurrentUser();
  ok(user !== null, "should be signed in");
  const status = getBackupStatus(user);
  ok(status.lastUpload !== null, "last upload should exist");
  strictEqual(status.upToDate, true);
  strictEqual(typeof status.lastUpload.at, "number");
});

await test("dirty detection reports outdated after local changes", async () => {
  resetStore();
  userStore.getState().toggleFavorite("dirty-a");
  await upload();

  userStore.getState().toggleFavorite("dirty-b");

  const gateway = await getGateway();
  const user = gateway.getCurrentUser();
  ok(user !== null, "should be signed in");
  strictEqual(getBackupStatus(user).upToDate, false);
});

await test("identical upload is skipped (no pointless writes)", async () => {
  resetStore();
  userStore.getState().toggleFavorite("dup-a");

  const gateway = await getGateway();
  const original = gateway.saveSnapshot.bind(gateway);
  let saves = 0;
  gateway.saveSnapshot = async (snapshot: CloudSnapshot) => {
    saves++;
    await original(snapshot);
  };

  await upload();
  strictEqual(saves, 1, "first upload writes the backup");

  await upload();
  strictEqual(saves, 1, "identical upload must not write again");
});

await test("restore marks the local data as up to date", async () => {
  resetStore();
  userStore.getState().toggleFavorite("restore-a");
  await upload();

  userStore.getState().toggleFavorite("restore-b");
  const gateway = await getGateway();
  const user = gateway.getCurrentUser();
  ok(user !== null, "should be signed in");
  strictEqual(getBackupStatus(user).upToDate, false, "dirty before restore");

  await restore();
  strictEqual(getBackupStatus(user).upToDate, true, "current after restore");
});

await test("friendlyErrorMessage maps a cancelled popup", () => {
  const err = new Error("popup closed") as Error & { code?: string };
  err.code = "auth/popup-closed-by-user";
  strictEqual(friendlyErrorMessage(err, true), "Sign in was cancelled.");
});

await test("friendlyErrorMessage maps a denied permission", () => {
  const err = new Error("denied") as Error & { code?: string };
  err.code = "permission-denied";
  strictEqual(friendlyErrorMessage(err, true), "You don't have access to this backup.");
});

await test("friendlyErrorMessage reports offline when offline", () => {
  strictEqual(friendlyErrorMessage(new Error("anything"), false), "You're offline.");
});

await test("friendlyErrorMessage maps a network failure", () => {
  const err = new Error("network") as Error & { code?: string };
  err.code = "auth/network-request-failed";
  strictEqual(friendlyErrorMessage(err, true), "You're offline.");
});

await test("friendlyErrorMessage falls back for unexpected errors", () => {
  strictEqual(friendlyErrorMessage(new Error("boom"), true), "Something went wrong. Try again.");
  strictEqual(friendlyErrorMessage("no error object at all", true), "Something went wrong. Try again.");
});
