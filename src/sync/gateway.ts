import type { CloudGateway } from "./types";
import { createFakeGateway } from "./fake-gateway";
import { isFirebaseConfigured } from "../lib/firebase/config";

let gatewayPromise: Promise<CloudGateway> | null = null;

/**
 * Returns the process-wide cloud gateway.
 *
 * Without Firebase configuration the fake gateway is used (feature disabled).
 * Otherwise the Firebase gateway is created lazily via dynamic import so the
 * firestore sync adapter never loads into the application boot path.
 */
export function getGateway(): Promise<CloudGateway> {
  if (gatewayPromise === null) {
    gatewayPromise = (async () => {
      if (!isFirebaseConfigured()) {
        return createFakeGateway();
      }
      const { createFirebaseGateway } = await import("./firebase");
      return createFirebaseGateway();
    })();
  }
  return gatewayPromise;
}

/**
 * Test-only override for the process-wide gateway. Passing null restores the
 * default config-based selection. Not exported from the sync barrel.
 */
export function setGatewayForTesting(gateway: CloudGateway | null): void {
  gatewayPromise = gateway === null ? null : Promise.resolve(gateway);
}
