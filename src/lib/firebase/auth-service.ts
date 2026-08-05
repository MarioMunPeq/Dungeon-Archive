import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import type { Unsubscribe } from "firebase/auth";
import { getAuthInstance, getGoogleProvider } from "./auth";

export interface AuthUser {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
}

function toAuthUser(user: {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
}): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

function requireAuth() {
  const auth = getAuthInstance();
  if (auth === null) {
    throw new Error("Firebase is not configured");
  }
  return auth;
}

export function signInWithGoogle(): Promise<AuthUser | void> {
  const auth = requireAuth();
  const provider = getGoogleProvider();
  if (import.meta.env.PROD) {
    return signInWithRedirect(auth, provider);
  }

  return signInWithPopup(auth, provider).then((result) => toAuthUser(result.user));
}

export function logout(): Promise<void> {
  return signOut(requireAuth());
}

export function subscribeToAuth(callback: (user: AuthUser | null) => void): Unsubscribe {
  return onAuthStateChanged(requireAuth(), (user) => {
    callback(user === null ? null : toAuthUser(user));
  });
}
