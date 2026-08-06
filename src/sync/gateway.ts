import type { CloudGateway } from "./types";
import { createFakeGateway } from "./fake-gateway";
import { createDisabledGateway } from "./disabled-gateway";
import { isFirebaseConfigured } from "../lib/firebase/config";

let gatewayPromise: Promise<CloudGateway> | null = null;

/**
 * Safe production check for environments without `import.meta.env`
 * (Node/tsx tests), mirroring the pattern in the auth service.
 */
function isProductionBuild(): boolean {
  try {
    return import.meta.env.PROD === true;
  } catch {
    return false;
  }
}

/**
 * Returns the process-wide cloud gateway.
 *
 * Without Firebase configuration the feature is disabled: the fake gateway is
 * used in development and tests, and a disabled gateway in production builds
 * (so no fake sign-in ever ships). With configuration, the Firebase gateway is
 * created lazily via dynamic import so the Firestore sync adapter never loads
 * into the application boot path.
 */
export function getGateway(): Promise<CloudGateway> {
  if (gatewayPromise === null) {
    gatewayPromise = (async () => {
      if (!isFirebaseConfigured()) {
        if (isProductionBuild()) {
          return createDisabledGateway();
        }
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
