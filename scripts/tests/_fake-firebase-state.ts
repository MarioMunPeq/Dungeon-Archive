export interface FakeAuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
}

export const fakeFirebaseState = {
  user: null as FakeAuthUser | null,
  authListeners: new Set<(user: FakeAuthUser | null) => void>(),
  data: new Map<string, unknown>(),
  apps: [] as unknown[],
};

export function setFakeUser(user: FakeAuthUser | null): void {
  fakeFirebaseState.user = user;
  for (const listener of fakeFirebaseState.authListeners) {
    listener(user);
  }
}
