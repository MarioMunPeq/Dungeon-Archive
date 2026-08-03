import { doc, getDoc, setDoc } from "firebase/firestore";
import type { CloudGateway, CloudSnapshot, CloudUser } from "./types";
import { auth } from "../lib/firebase/auth";
import { db } from "../lib/firebase/firestore";
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
  function requireUid(): string {
    const user = auth.currentUser;
    if (user === null) throw new Error("Not signed in");
    return user.uid;
  }

  return {
    getCurrentUser: () => {
      const user = auth.currentUser;
      return user ? toCloudUser(user) : null;
    },

    signIn: async () => toCloudUser(await signInWithGoogle()),

    signOut: () => logout(),

    onAuthChange: (listener) => {
      return subscribeToAuth((user) => {
        listener(user === null ? null : toCloudUser(user));
      });
    },

    fetchSnapshot: async () => {
      const ref = doc(db, "users", requireUid(), "backup");
      const snapshot = await getDoc(ref);
      const data = snapshot.data();
      if (data === undefined) return null;
      return data as CloudSnapshot;
    },

    saveSnapshot: async (snapshot: CloudSnapshot) => {
      const ref = doc(db, "users", requireUid(), "backup");
      await setDoc(ref, snapshot);
    },
  };
}
