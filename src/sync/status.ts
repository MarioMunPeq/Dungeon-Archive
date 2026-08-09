import { useEffect } from "react";
import { create } from "zustand";
import type { CloudGateway, CloudUser } from "./types";
import { getGateway } from "./gateway";

export type CloudSyncPhase = "idle" | "syncing" | "failed";

interface CloudSyncState {
  readonly phase: CloudSyncPhase;
  readonly error: string | null;
  readonly markSyncing: () => void;
  readonly markFailed: (error: string) => void;
  readonly markIdle: () => void;
}

export const useCloudSync = create<CloudSyncState>((set) => ({
  phase: "idle",
  error: null,
  markSyncing: () => set({ phase: "syncing", error: null }),
  markFailed: (error) => set({ phase: "failed", error }),
  markIdle: () => set({ phase: "idle", error: null }),
}));

interface CloudSessionState {
  readonly gateway: CloudGateway | null;
  readonly user: CloudUser | null;
  readonly ready: boolean;
}

/**
 * Singleton session state: the gateway and the auth listener live here for the
 * whole app session instead of being re-created on every `useCloudStatus`
 * mount. The auth subscription is registered exactly once and never torn down,
 * so navigating routes (which remount pages inside the keyed RouteTransition)
 * does not re-resolve the gateway or re-subscribe to auth state.
 */
export const useCloudSessionStore = create<CloudSessionState>(() => ({
  gateway: null,
  user: null,
  ready: false,
}));

let sessionStarted = false;

/**
 * Initializes the cloud session exactly once per app run: resolves the
 * process-wide gateway and subscribes the single auth listener. Safe to call
 * from anywhere (the app root and every hook consumer); only the first call
 * performs work.
 */
export function startCloudSession(): void {
  if (sessionStarted) return;
  sessionStarted = true;
  void getGateway().then((gateway) => {
    useCloudSessionStore.setState({ gateway });
    console.log(
      "[cloud] gateway resolved:",
      gateway.disabled === true ? "disabled (no Firebase config)" : "firebase",
    );
    gateway.onAuthChange((nextUser) => {
      useCloudSessionStore.setState({ user: nextUser, ready: true });
      console.log(
        "[cloud] auth state:",
        nextUser === null ? "signed out" : `signed in as ${nextUser.email ?? nextUser.uid}`,
      );
    });
  });
}

export interface CloudStatus {
  readonly gateway: CloudGateway | null;
  readonly user: CloudUser | null;
  readonly ready: boolean;
  readonly signedIn: boolean;
  readonly syncing: boolean;
  readonly failed: boolean;
  readonly error: string | null;
  /** True when the build has no Firebase configuration (feature unavailable). */
  readonly disabled: boolean;
}

export function useCloudStatus(): CloudStatus {
  const gateway = useCloudSessionStore((s) => s.gateway);
  const user = useCloudSessionStore((s) => s.user);
  const ready = useCloudSessionStore((s) => s.ready);
  const phase = useCloudSync((s) => s.phase);
  const error = useCloudSync((s) => s.error);

  useEffect(() => {
    startCloudSession();
  }, []);

  return {
    gateway,
    user,
    ready,
    signedIn: user !== null,
    syncing: phase === "syncing",
    failed: phase === "failed",
    error,
    disabled: gateway?.disabled === true,
  };
}
