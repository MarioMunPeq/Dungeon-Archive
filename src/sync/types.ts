import type { UserState } from "@/user-state";

export interface CloudUser {
  readonly uid: string;
  readonly displayName: string | null;
  readonly email: string | null;
}

export interface CloudMetadata {
  readonly createdAt: number;
  readonly adventureCount: number;
  readonly playerCount: number;
  readonly favoriteCount: number;
  readonly sessionCount: number;
  readonly activeAdventureTitle: string | null;
}

export interface CloudSnapshot {
  readonly state: UserState;
  readonly metadata: CloudMetadata;
  readonly updatedAt: number;
  readonly appVersion: string;
}

/**
 * Minimal cloud transport. No sync engine, no merge, no listeners beyond auth.
 * Implementations are pure transports; all orchestration lives in the service.
 * The transport resolves the owning user from the authenticated session; the
 * caller never supplies a UID.
 */
export interface CloudGateway {
  getCurrentUser(): CloudUser | null;
  signIn(): Promise<CloudUser | undefined>;
  signOut(): Promise<void>;
  onAuthChange(listener: (user: CloudUser | null) => void): () => void;
  fetchSnapshot(): Promise<CloudSnapshot | null>;
  saveSnapshot(snapshot: CloudSnapshot): Promise<void>;
}
