import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import type { Unsubscribe } from "firebase/auth";
import { auth, googleProvider } from "./auth";

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

export function signInWithGoogle(): Promise<AuthUser> {
  return signInWithPopup(auth, googleProvider).then((result) => toAuthUser(result.user));
}

export function logout(): Promise<void> {
  return signOut(auth);
}

export function subscribeToAuth(callback: (user: AuthUser | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, (user) => {
    callback(user === null ? null : toAuthUser(user));
  });
}
