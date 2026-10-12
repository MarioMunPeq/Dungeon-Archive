import type { UserState } from "@/user-state";

export interface CloudUser {
  readonly uid: string;
  readonly displayName: string | null;
  readonly email: string | null;
}

/**
 * Snapshot metadata is informational only — nothing reads these back to drive
 * behaviour, so the retired adventure fields were dropped rather than migrated.
 * Older snapshots carrying them still restore fine; the extra keys are ignored.
 */
export interface CloudMetadata {
  readonly createdAt: number;
  readonly characterCount: number;
  readonly favoriteCount: number;
  readonly sessionCount: number;
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
  /**
   * True for the disabled gateway used in production builds without Firebase
   * configuration. The UI must treat the feature as unavailable.
   */
  readonly disabled?: boolean;
  getCurrentUser(): CloudUser | null;
  signIn(): Promise<CloudUser | undefined>;
  signOut(): Promise<void>;
  onAuthChange(listener: (user: CloudUser | null) => void): () => void;
  fetchSnapshot(): Promise<CloudSnapshot | null>;
  saveSnapshot(snapshot: CloudSnapshot): Promise<void>;
}
