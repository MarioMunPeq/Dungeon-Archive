import type { UserState } from "@/user-state";

export interface CloudUser {
  readonly uid: string;
  readonly displayName: string | null;
  readonly email: string | null;
}

export interface CloudSnapshot {
  readonly state: UserState;
}

/**
 * Minimal cloud transport. No sync engine, no merge, no listeners beyond auth.
 * Implementations are pure transports; all orchestration lives in the service.
 */
export interface CloudGateway {
  getCurrentUser(): CloudUser | null;
  signIn(): Promise<CloudUser>;
  signOut(): Promise<void>;
  onAuthChange(listener: (user: CloudUser | null) => void): () => void;
  fetchSnapshot(uid: string): Promise<CloudSnapshot | null>;
  saveSnapshot(uid: string, snapshot: CloudSnapshot): Promise<void>;
}
