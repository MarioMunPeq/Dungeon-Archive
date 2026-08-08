import { normalize, migrate, toUserState, write, userStore } from "../user-state/index";
import type { UserState } from "../user-state/index";
import { APP_VERSION } from "../config/constants";
import type { CloudMetadata, CloudSnapshot, CloudUser } from "./types";
import { getGateway } from "./gateway";

const LAST_UPLOAD_KEY = "dungeon:backup:lastUpload:v2";

export interface LastUploadRecord {
  readonly uid: string;
  readonly at: number;
  readonly hash: string;
}

export interface BackupStatus {
  readonly upToDate: boolean;
  readonly lastUpload: LastUploadRecord | null;
}

/**
 * Deterministic 32-bit FNV-1a hash. Used to compare local state against the
 * last uploaded state without a network read. Collisions are astronomically
 * unlikely for user data sizes; a mismatch only ever causes an extra upload.
 */
function hashString(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16);
}

function serializeState(state: UserState): string {
  return JSON.stringify(toUserState(state));
}

export function currentStateHash(): string {
  return hashString(serializeState(userStore.getState()));
}

function readLastUpload(uid: string): LastUploadRecord | null {
  try {
    const raw = localStorage.getItem(LAST_UPLOAD_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw) as { uid?: unknown; at?: unknown; hash?: unknown };
    if (
      typeof parsed.uid !== "string" ||
      typeof parsed.at !== "number" ||
      typeof parsed.hash !== "string"
    ) {
      return null;
    }
    if (parsed.uid !== uid) return null;
    return { uid: parsed.uid, at: parsed.at, hash: parsed.hash };
  } catch {
    return null;
  }
}

function writeLastUpload(record: LastUploadRecord): void {
  try {
    localStorage.setItem(LAST_UPLOAD_KEY, JSON.stringify(record));
  } catch {
    // storage is best-effort; the backup itself already succeeded
  }
}

export function computeMetadata(state: UserState, now: number): CloudMetadata {
  const active = state.adventures.find((a) => a.id === state.activeAdventureId) ?? null;
  return {
    createdAt: now,
    adventureCount: state.adventures.length,
    characterCount: state.characters.length,
    favoriteCount: state.favorites.length,
    sessionCount: state.session.length,
    activeAdventureTitle: active ? active.title : null,
  };
}

function buildSnapshot(now: number): CloudSnapshot {
  const state = toUserState(userStore.getState());
  return {
    state,
    metadata: computeMetadata(state, now),
    updatedAt: now,
    appVersion: APP_VERSION,
  };
}

/**
 * Whether the local state matches the last uploaded backup for this user.
 * Powers the current/outdated badge and the "already up to date" guard
 * without downloading anything.
 */
export function getBackupStatus(user: CloudUser): BackupStatus {
  const lastUpload = readLastUpload(user.uid);
  if (lastUpload === null) return { upToDate: false, lastUpload: null };
  return { upToDate: currentStateHash() === lastUpload.hash, lastUpload };
}

/**
 * Uploads the current local state as the single cloud snapshot.
 * Identical uploads are skipped (no pointless writes).
 */
export async function upload(): Promise<void> {
  const gateway = await getGateway();
  const user = gateway.getCurrentUser();
  if (user === null) {
    throw new Error("Not signed in");
  }
  const hash = currentStateHash();
  const lastUpload = readLastUpload(user.uid);
  if (lastUpload !== null && lastUpload.hash === hash) {
    return;
  }
  const now = Date.now();
  await gateway.saveSnapshot(buildSnapshot(now));
  writeLastUpload({ uid: user.uid, at: now, hash });
}

/**
 * Replaces local state with the cloud snapshot, reusing the exact local
 * hydration pipeline: migrate -> normalize -> _replace -> write.
 */
export async function restore(): Promise<void> {
  const gateway = await getGateway();
  const user = gateway.getCurrentUser();
  if (user === null) {
    throw new Error("Not signed in");
  }
  const snapshot = await gateway.fetchSnapshot();
  if (snapshot === null) {
    throw new Error("No cloud backup found");
  }
  const processed = normalize(migrate(snapshot.state));
  userStore.getState()._replace(processed);
  write(processed);
  const now = typeof snapshot.updatedAt === "number" ? snapshot.updatedAt : Date.now();
  writeLastUpload({ uid: user.uid, at: now, hash: currentStateHash() });
}
