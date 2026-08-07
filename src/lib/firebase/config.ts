import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
// TEMP DEBUG
import { authDebug, maskSecret } from "./auth-debug";

interface FirebaseConfig {
  readonly apiKey: string;
  readonly authDomain: string;
  readonly projectId: string;
  readonly storageBucket: string;
  readonly messagingSenderId: string;
  readonly appId: string;
}

/**
 * Reads Vite env vars via literal access so Vite statically inlines them at
 * build time. The try/catch keeps the module loadable outside Vite (tsx tests),
 * where import.meta.env does not exist.
 */
function loadEnv(): Record<string, string | undefined> {
  try {
    return {
      VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
      VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    };
  } catch {
    return {};
  }
}

const env = loadEnv();

const firebaseConfig: FirebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: env.VITE_FIREBASE_APP_ID ?? "",
};

let firebaseAppInstance: FirebaseApp | null = null;

function createFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (firebaseAppInstance === null) {
    firebaseAppInstance = initializeApp(firebaseConfig);
    // TEMP DEBUG — Phase 3: log the effective Firebase config (apiKey masked).
    authDebug("Firebase initialized", {
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      apiKey: maskSecret(firebaseConfig.apiKey),
      currentUser: "auth not yet created — see 'Auth instance created' log",
    });
  }
  return firebaseAppInstance;
}

export function isFirebaseConfigured(): boolean {
  return (
    firebaseConfig.apiKey !== "" &&
    firebaseConfig.authDomain !== "" &&
    firebaseConfig.projectId !== "" &&
    firebaseConfig.appId !== "" &&
    firebaseConfig.messagingSenderId !== ""
  );
}

export function getFirebaseApp(): FirebaseApp | null {
  return createFirebaseApp();
}
