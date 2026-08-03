import { getAuth, GoogleAuthProvider } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirebaseApp } from "./config";

let authInstance: Auth | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;

export function getAuthInstance(): Auth | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    return null;
  }
  if (authInstance === null) {
    authInstance = getAuth(firebaseApp);
  }
  return authInstance;
}

export function getGoogleProvider(): GoogleAuthProvider {
  if (googleProviderInstance === null) {
    googleProviderInstance = new GoogleAuthProvider();
    googleProviderInstance.setCustomParameters({
      prompt: "select_account",
    });
  }
  return googleProviderInstance;
}
