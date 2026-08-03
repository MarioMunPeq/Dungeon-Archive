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

export async function signOut(_auth: FakeAuth): Promise<void> {
  setFakeUser(null);
}
