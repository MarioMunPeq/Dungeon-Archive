import { doc, getDoc, setDoc } from "firebase/firestore";
import type { CloudGateway, CloudSnapshot, CloudUser } from "./types";
import { getAuthInstance } from "../lib/firebase/auth";
import { getFirestoreInstance } from "../lib/firebase/firestore";
import { signInWithGoogle, logout, subscribeToAuth } from "../lib/firebase/auth-service";
import type { AuthUser } from "../lib/firebase/auth-service";

function toCloudUser(user: AuthUser): CloudUser {
  return { uid: user.uid, displayName: user.displayName, email: user.email };
}

export function createFirebaseGateway(): CloudGateway {
  /**
   * The owning user is always the authenticated session. The UID never flows
   * through the application and is never trusted from a caller parameter.
   */
  const auth = getAuthInstance();
  const db = getFirestoreInstance();

  console.log("[cloud] Firebase gateway created", {
    authConfigured: auth !== null,
    firestoreConfigured: db !== null,
    projectId:
      (db as { app?: { options?: { projectId?: string } } } | null)?.app?.options?.projectId ??
      null,
  });

  function describeAuthState(): string {
    if (!auth) return "not configured";
    const user = auth.currentUser;
    if (user === null) return "no signed-in session";
    return `signed in as ${user.email ?? user.uid} (uid=${user.uid})`;
  }

  async function logTokenHealth(): Promise<void> {
    if (!auth) return;
    const user = auth.currentUser;
    if (user === null) return;
    try {
      const token = await user.getIdToken();
      console.log(`[cloud] id token fetch: ok (${token.length} chars)`);
    } catch (error) {
      console.error("[cloud] id token fetch failed:", error);
    }
  }

  function requireUid(): string {
    if (!auth) {
      throw new Error("Firebase is not configured");
    }
    const user = auth.currentUser;
    if (user === null) throw new Error("Not signed in");
    return user.uid;
  }

  return {
    getCurrentUser: () => {
      if (!auth) {
        return null;
      }
      const user = auth.currentUser;
      return user ? toCloudUser(user) : null;
    },

    signIn: async () => {
      console.log("[cloud] signIn: starting Google sign-in");
      const authUser = await signInWithGoogle();
      console.log(
        "[cloud] signIn: Google sign-in returned:",
        authUser ? (authUser.email ?? authUser.uid) : "null",
      );
      if (authUser) {
        return toCloudUser(authUser);
      }

      if (!auth) {
        throw new Error("Firebase is not configured");
      }
      const current = auth.currentUser;
      if (current) {
        return toCloudUser(current);
      }

      return undefined;
    },

    signOut: () => logout(),

    onAuthChange: (listener) => {
      return subscribeToAuth((user) => {
        console.log(
          "[cloud] auth changed:",
          user === null ? "signed out" : `signed in as ${user.email ?? user.uid}`,
        );
        listener(user === null ? null : toCloudUser(user));
      });
    },

    fetchSnapshot: async () => {
      if (!db) {
        throw new Error("Firebase is not configured");
      }
      await logTokenHealth();
      const ref = doc(db, "users", requireUid(), "backup");
      console.log("[cloud] fetchSnapshot: reading document", ref.path, "-", describeAuthState());
      try {
        const snapshot = await getDoc(ref);
        console.log("[cloud] fetchSnapshot: ok, document exists =", snapshot.exists());
        const data = snapshot.data();
        if (data === undefined) return null;
        return data as CloudSnapshot;
      } catch (error) {
        console.error("[cloud] fetchSnapshot FAILED:", error);
        throw error;
      }
    },

    saveSnapshot: async (snapshot: CloudSnapshot) => {
      if (!db) {
        throw new Error("Firebase is not configured");
      }
      await logTokenHealth();
      const ref = doc(db, "users", requireUid(), "backup");
      console.log("[cloud] saveSnapshot: writing document", ref.path, "-", describeAuthState(), {
        updatedAt: snapshot.updatedAt,
        appVersion: snapshot.appVersion,
      });
      try {
        await setDoc(ref, snapshot);
        console.log("[cloud] saveSnapshot: ok");
      } catch (error) {
        console.error("[cloud] saveSnapshot FAILED:", error);
        throw error;
      }
    },
  };
}
