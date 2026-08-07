import { getAuth, GoogleAuthProvider } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirebaseApp } from "./config";
// TEMP DEBUG
import { authDebug, debugCurrentUser } from "./auth-debug";

let authInstance: Auth | null = null;
let googleProviderInstance: GoogleAuthProvider | null = null;

export function getAuthInstance(): Auth | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    return null;
  }
  if (authInstance === null) {
    authInstance = getAuth(firebaseApp);
    // TEMP DEBUG — Phase 3: first creation of the Firebase Auth instance.
    authDebug("Auth instance created", debugCurrentUser(authInstance));
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
