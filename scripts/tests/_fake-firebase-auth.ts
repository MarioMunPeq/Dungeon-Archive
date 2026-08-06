import { fakeFirebaseState, setFakeUser } from "./_fake-firebase-state";
import type { FakeAuthUser } from "./_fake-firebase-state";

export interface FakeAuth {
  currentUser: FakeAuthUser | null;
}

export interface FakeProvider {
  providerId: string;
}

export function getAuth(): FakeAuth {
  return {
    get currentUser() {
      return fakeFirebaseState.user;
    },
  };
}

export class GoogleAuthProvider implements FakeProvider {
  readonly providerId = "google.com";

  setCustomParameters(_params: Record<string, string>): FakeProvider {
    return this;
  }
}

export function onAuthStateChanged(
  _auth: FakeAuth,
  listener: (user: FakeAuthUser | null) => void,
): () => void {
  fakeFirebaseState.authListeners.add(listener);
  listener(fakeFirebaseState.user);
  return () => {
    fakeFirebaseState.authListeners.delete(listener);
  };
}

export async function signInWithPopup(
  _auth: FakeAuth,
  _provider: FakeProvider,
): Promise<{ user: FakeAuthUser }> {
  if (fakeFirebaseState.signInError !== null) {
    throw fakeFirebaseState.signInError;
  }
  const user: FakeAuthUser = {
    uid: "firebase-user",
    displayName: "Firebase User",
    email: "firebase@example.com",
  };
  setFakeUser(user);
  return { user };
}

export async function signInWithRedirect(
  _auth: FakeAuth,
  _provider: FakeProvider,
): Promise<void> {
  if (fakeFirebaseState.signInError !== null) {
    throw fakeFirebaseState.signInError;
  }
  setFakeUser({
    uid: "firebase-user",
    displayName: "Firebase User",
    email: "firebase@example.com",
  });
}

export async function signOut(_auth: FakeAuth): Promise<void> {
  setFakeUser(null);
}

export async function getRedirectResult(
  _auth: FakeAuth,
): Promise<{ user: FakeAuthUser } | null> {
  return null;
}
