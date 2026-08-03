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

    fetchSnapshot: async (uid) => {
      const ref = doc(db, "users", uid, "backup");
      const snapshot = await getDoc(ref);
      const data = snapshot.data();
      if (data === undefined) return null;
      return data as CloudSnapshot;
    },

    saveSnapshot: async (uid, snapshot) => {
      const ref = doc(db, "users", uid, "backup");
      await setDoc(ref, snapshot);
    },
  };
}
