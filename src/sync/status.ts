import { useEffect, useState } from "react";
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
  const [gateway, setGateway] = useState<CloudGateway | null>(null);
  const [user, setUser] = useState<CloudUser | null>(null);
  const [ready, setReady] = useState(false);
  const phase = useCloudSync((s) => s.phase);
  const error = useCloudSync((s) => s.error);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;
    void getGateway().then((next) => {
      if (cancelled) return;
      setGateway(next);
      unsubscribe = next.onAuthChange((nextUser) => {
        setUser(nextUser);
        setReady(true);
      });
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
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
