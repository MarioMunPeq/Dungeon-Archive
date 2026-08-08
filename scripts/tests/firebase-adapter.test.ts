import { strictEqual, ok, deepStrictEqual } from "node:assert";
import { registerHooks } from "node:module";

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
// Intercept the firebase/* specifiers so the real adapter (src/sync/firebase.ts)
// runs against an in-memory fake SDK. Must be registered before the adapter is
// imported.
// ---------------------------------------------------------------------------
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "firebase/app") {
      return { url: new URL("./_fake-firebase-app.ts", import.meta.url).href, shortCircuit: true };
    }
    if (specifier === "firebase/auth") {
      return { url: new URL("./_fake-firebase-auth.ts", import.meta.url).href, shortCircuit: true };
    }
    if (specifier === "firebase/firestore") {
      return {
        url: new URL("./_fake-firebase-firestore.ts", import.meta.url).href,
        shortCircuit: true,
      };
    }
    // The lib/firebase config gate reads env vars, so tests redirect it to a
    // fake that always yields an app. Everything downstream runs against the
    // in-memory SDK fakes above.
    if (specifier === "./config" && (context.parentURL ?? "").includes("src/lib/firebase/")) {
      return {
        url: new URL("./_fake-firebase-config.ts", import.meta.url).href,
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
});

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
// Imports (after the SDK mock and localStorage mock are in place)
// ---------------------------------------------------------------------------
const { createFirebaseGateway } = await import("../../src/sync/firebase");
const { upload, restore, friendlyErrorMessage } = await import("../../src/sync/index");
const { setGatewayForTesting } = await import("../../src/sync/gateway");
const { userStore } = await import("../../src/user-state/store");
const { STORAGE_KEY } = await import("../../src/user-state/types");
const { setFakeUser, fakeFirebaseState } = await import("./_fake-firebase-state");
import type { CloudSnapshot } from "../../src/sync/types";

const gateway = createFirebaseGateway();

function resetStore(): void {
  userStore.getState()._reset();
  store.clear();
}

function errorWithCode(message: string, code: string): Error & { code?: string } {
  return Object.assign(new Error(message), { code });
}

await test("adapter starts signed out", () => {
  setFakeUser(null);
  strictEqual(gateway.getCurrentUser(), null);
});

await test("signIn returns a CloudUser and updates current user", async () => {
  setFakeUser(null);
  const user = await gateway.signIn();
  ok(user !== undefined, "popup signIn resolves with a user");
  strictEqual(user.uid, "firebase-user");
  strictEqual(user.displayName, "Firebase User");
  strictEqual(user.email, "firebase@example.com");
  deepStrictEqual(gateway.getCurrentUser(), {
    uid: "firebase-user",
    displayName: "Firebase User",
    email: "firebase@example.com",
  });
});

await test("signOut clears the current user", async () => {
  await gateway.signIn();
  await gateway.signOut();
  strictEqual(gateway.getCurrentUser(), null);
});

await test("onAuthChange fires with current user then null on sign out", async () => {
  setFakeUser(null);
  const events: (string | null)[] = [];
  const unsubscribe = gateway.onAuthChange((user) => {
    events.push(user?.uid ?? null);
  });
  deepStrictEqual(events, [null], "listener fires immediately with current user");
  await gateway.signIn();
  await gateway.signOut();
  deepStrictEqual(events, [null, "firebase-user", null]);
  unsubscribe();
});

await test("auth state survives a new gateway (session restored on refresh)", async () => {
  setFakeUser(null);
  await gateway.signIn();
  const second = createFirebaseGateway();
  deepStrictEqual(second.getCurrentUser(), gateway.getCurrentUser());
  strictEqual(second.getCurrentUser()?.uid, "firebase-user");
});

await test("fetchSnapshot returns null when nothing is stored", async () => {
  await gateway.signIn();
  const snapshot = await gateway.fetchSnapshot();
  strictEqual(snapshot, null);
});

await test("saveSnapshot then fetchSnapshot round-trips a CloudSnapshot", async () => {
  await gateway.signIn();
  const snapshot: CloudSnapshot = {
    state: { favorites: ["a"], recentSearches: ["b"] },
    metadata: {
      createdAt: 1,
      adventureCount: 0,
      characterCount: 0,
      favoriteCount: 1,
      sessionCount: 0,
      activeAdventureTitle: null,
    },
    updatedAt: 2,
    appVersion: "0.1.0",
  } as unknown as CloudSnapshot;
  await gateway.saveSnapshot(snapshot);
  const fetched = await gateway.fetchSnapshot();
  ok(fetched !== null, "snapshot should exist after save");
  deepStrictEqual(fetched, snapshot);
});

await test("saveSnapshot writes under users/{uid}/backup", async () => {
  await gateway.signIn();
  await gateway.saveSnapshot({
    state: { favorites: ["x"] },
    metadata: {
      createdAt: 1,
      adventureCount: 0,
      characterCount: 0,
      favoriteCount: 1,
      sessionCount: 0,
      activeAdventureTitle: null,
    },
    updatedAt: 2,
    appVersion: "0.1.0",
  } as unknown as CloudSnapshot);
  const stored = fakeFirebaseState.data.get("users/firebase-user/backup") as CloudSnapshot;
  ok(stored !== undefined, "backup doc exists under users/firebase-user/backup");
  deepStrictEqual(stored.state.favorites, ["x"]);
});

await test("saveSnapshot rejects when signed out (UID never trusted)", async () => {
  setFakeUser(null);
  await assertRejects(
    () =>
      gateway.saveSnapshot({
        state: { favorites: [] },
        metadata: {
          createdAt: 1,
          adventureCount: 0,
          characterCount: 0,
          favoriteCount: 0,
          sessionCount: 0,
          activeAdventureTitle: null,
        },
        updatedAt: 2,
        appVersion: "0.1.0",
      } as unknown as CloudSnapshot),
    /Not signed in/,
  );
});

await test("fetchSnapshot rejects when signed out (UID never trusted)", async () => {
  setFakeUser(null);
  await assertRejects(() => gateway.fetchSnapshot(), /Not signed in/);
});

await test("signIn maps a cancelled popup to a friendly message", async () => {
  setFakeUser(null);
  fakeFirebaseState.signInError = errorWithCode("popup closed", "auth/popup-closed-by-user");
  let caught: unknown;
  try {
    await gateway.signIn();
  } catch (e) {
    caught = e;
  }
  fakeFirebaseState.signInError = null;
  ok(caught !== undefined, "signIn should reject");
  strictEqual(friendlyErrorMessage(caught, true), "Sign in was cancelled.");
});

await test("fetchSnapshot maps permission denied to a friendly message", async () => {
  await gateway.signIn();
  fakeFirebaseState.firestoreError = errorWithCode("denied", "permission-denied");
  let caught: unknown;
  try {
    await gateway.fetchSnapshot();
  } catch (e) {
    caught = e;
  }
  fakeFirebaseState.firestoreError = null;
  ok(caught !== undefined, "fetchSnapshot should reject");
  strictEqual(friendlyErrorMessage(caught, true), "You don't have access to this backup.");
});

await test("offline maps to a friendly message", () => {
  strictEqual(friendlyErrorMessage(new Error("network"), false), "You're offline.");
});

await test("service upload rejects through the adapter when signed out", async () => {
  setGatewayForTesting(gateway);
  setFakeUser(null);
  await assertRejects(upload, /Not signed in/);
});

await test("service upload then restore round-trips through the adapter", async () => {
  setGatewayForTesting(gateway);
  await gateway.signIn();

  resetStore();
  userStore.getState().toggleFavorite("test-entity");
  userStore.getState().addRecentSearch("fireball");

  await upload();

  const stored = fakeFirebaseState.data.get("users/firebase-user/backup") as CloudSnapshot;
  ok(stored !== undefined, "upload persisted the backup doc");
  deepStrictEqual(stored.state.favorites, ["test-entity"]);
  deepStrictEqual(stored.state.recentSearches, ["fireball"]);

  resetStore();
  strictEqual(userStore.getState().favorites.length, 0, "local state cleared before restore");

  await restore();

  deepStrictEqual(userStore.getState().favorites, ["test-entity"]);
  deepStrictEqual(userStore.getState().recentSearches, ["fireball"]);
  strictEqual(userStore.getState().favoritesSet.has("test-entity"), true);

  const persisted = JSON.parse(store.get(STORAGE_KEY) ?? "null") as { favorites: string[] };
  deepStrictEqual(persisted.favorites, ["test-entity"], "restore persisted to localStorage");
});

await test("service upload stores metadata, updatedAt and appVersion in the doc", async () => {
  setGatewayForTesting(gateway);
  await gateway.signIn();
  resetStore();
  userStore.getState().toggleFavorite("meta-adapter");

  await upload();

  const stored = fakeFirebaseState.data.get("users/firebase-user/backup") as CloudSnapshot;
  ok(stored !== undefined, "backup doc exists");
  deepStrictEqual(stored.state.favorites, ["meta-adapter"]);
  strictEqual(stored.metadata.favoriteCount, 1);
  strictEqual(stored.metadata.adventureCount, 0);
  strictEqual(typeof stored.updatedAt, "number");
  ok(stored.appVersion.length > 0, "appVersion is stored");
});

await test("service restore rejects through the adapter when signed out", async () => {
  setGatewayForTesting(gateway);
  setFakeUser(null);
  await assertRejects(restore, /Not signed in/);
});

await test("service restore rejects through the adapter with no backup", async () => {
  setGatewayForTesting(gateway);
  await gateway.signIn();
  await setDocFor("firebase-user", null);
  await assertRejects(restore, /No cloud backup found/);
});

async function setDocFor(uid: string, value: unknown): Promise<void> {
  if (value === null) {
    fakeFirebaseState.data.delete(`users/${uid}/backup`);
    return;
  }
  fakeFirebaseState.data.set(`users/${uid}/backup`, value);
}

setGatewayForTesting(null);
