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
      const authUser = await signInWithGoogle();
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
        listener(user === null ? null : toCloudUser(user));
      });
    },

    fetchSnapshot: async () => {
      if (!db) {
        throw new Error("Firebase is not configured");
      }
      const ref = doc(db, "users", requireUid(), "backup");
      const snapshot = await getDoc(ref);
      const data = snapshot.data();
      if (data === undefined) return null;
      return data as CloudSnapshot;
    },

    saveSnapshot: async (snapshot: CloudSnapshot) => {
      if (!db) {
        throw new Error("Firebase is not configured");
      }
      const ref = doc(db, "users", requireUid(), "backup");
      await setDoc(ref, snapshot);
    },
  };
}
