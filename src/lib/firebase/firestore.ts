import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getFirebaseApp } from "./config";

let firestoreInstance: Firestore | null = null;

export function getFirestoreInstance(): Firestore | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    return null;
  }
  if (firestoreInstance === null) {
    firestoreInstance = getFirestore(firebaseApp);
  }
  return firestoreInstance;
}
