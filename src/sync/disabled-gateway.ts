import type { CloudGateway } from "./types";

/**
 * CloudGateway used in production builds without Firebase configuration.
 * Cloud Backup is disabled: no sign-in, no storage, no Firebase import.
 * The gateway exists so the UI can distinguish "not available" from "loading".
 */
export function createDisabledGateway(): CloudGateway {
  return {
    disabled: true,
    getCurrentUser: () => null,
    signIn: async () => undefined,
    signOut: async () => {},
    onAuthChange: (listener) => {
      listener(null);
      return () => {};
    },
    fetchSnapshot: async () => null,
    saveSnapshot: async () => {},
  };
}
