import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import type { CloudGateway, CloudSnapshot, CloudUser } from "./types";
import { firebaseConfig } from "./config";

function toCloudUser(user: {
  uid: string;
  displayName: string | null;
  email: string | null;
}): CloudUser {
  return { uid: user.uid, displayName: user.displayName, email: user.email };
}

export function createFirebaseGateway(): CloudGateway {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

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

    signIn: async () => {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return toCloudUser(result.user);
    },

    signOut: async () => {
      await signOut(auth);
    },

    onAuthChange: (listener) => {
      return onAuthStateChanged(auth, (user) => {
        listener(user ? toCloudUser(user) : null);
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
