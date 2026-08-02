import { userStore, toUserState, migrate, normalize, write } from "../user-state/index";
import type { CloudSnapshot } from "./types";
import { getGateway } from "./gateway";

/**
 * Uploads the current local state as the single cloud snapshot.
 * The cloud is a serialized snapshot of local state; local is the source of truth.
 */
export async function upload(): Promise<void> {
  const gateway = await getGateway();
  const user = gateway.getCurrentUser();
  if (user === null) {
    throw new Error("Not signed in");
  }
  const snapshot: CloudSnapshot = { state: toUserState(userStore.getState()) };
  await gateway.saveSnapshot(user.uid, snapshot);
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
  const snapshot = await gateway.fetchSnapshot(user.uid);
  if (snapshot === null) {
    throw new Error("No cloud backup found");
  }
  const processed = normalize(migrate(snapshot.state));
  userStore.getState()._replace(processed);
  write(processed);
}
