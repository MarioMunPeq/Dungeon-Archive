import type { CloudGateway, CloudSnapshot, CloudUser } from "./types";

/**
 * In-memory CloudGateway for tests. No persistence, no Firebase.
 */
export function createFakeGateway(): CloudGateway {
  let currentUser: CloudUser | null = null;
  let snapshot: CloudSnapshot | null = null;
  const listeners = new Set<(user: CloudUser | null) => void>();

  function emit(): void {
    for (const listener of listeners) {
      listener(currentUser);
    }
  }

  return {
    getCurrentUser: () => currentUser,
    signIn: async () => {
      const user: CloudUser = { uid: "fake-user", displayName: "Fake User", email: "fake@example.com" };
      currentUser = user;
      emit();
      return user;
    },
    signOut: async () => {
      currentUser = null;
      emit();
    },
    onAuthChange: (listener) => {
      listeners.add(listener);
      listener(currentUser);
      return () => {
        listeners.delete(listener);
      };
    },
    fetchSnapshot: async () => snapshot,
    saveSnapshot: async (_uid, next) => {
      snapshot = next;
    },
  };
}
