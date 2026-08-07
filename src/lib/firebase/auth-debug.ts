// TEMP DEBUG — deep instrumentation of the production Google Sign-In flow.
// Remove this file and every `// TEMP DEBUG` marker once the failure point is known.
import type { Auth } from "firebase/auth";

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

function hasNavigator(): boolean {
  return typeof navigator !== "undefined";
}

/** Masks a secret, keeping only the last 6 characters visible. */
export function maskSecret(secret: string): string {
  if (secret.length <= 6) return "(too-short)";
  return `…${secret.slice(-6)}`;
}

/** Structured console line with a UTC timestamp for DevTools correlation. */
export function authDebug(tag: string, data?: unknown): void {
  // eslint-disable-next-line no-console -- TEMP DEBUG instrumentation
  console.log(`[AUTH-DEBUG] ${new Date().toISOString()} ${tag}`, data ?? "");
}

/** Vite build-mode flags. Guarded so tsx/node test runners stay inert. */
export function debugViteEnv(): Record<string, unknown> {
  try {
    return { DEV: import.meta.env.DEV, PROD: import.meta.env.PROD, MODE: import.meta.env.MODE };
  } catch {
    return { DEV: null, PROD: null, MODE: null };
  }
}

/** Current location + connectivity snapshot. */
export function debugLocationSnapshot(): Record<string, unknown> {
  if (!hasWindow()) {
    return { href: null, origin: null, pathname: null, referrer: null, onLine: null };
  }
  return {
    href: window.location.href,
    origin: window.location.origin,
    pathname: window.location.pathname,
    referrer: document.referrer,
    onLine: hasNavigator() ? navigator.onLine : null,
  };
}

/** Browser/PWA environment snapshot (Phase 9). */
export function debugBrowserEnvironment(): Record<string, unknown> {
  const ua = hasNavigator() ? navigator.userAgent : "";
  const chromeMatch = ua.match(/Chrome\/(\d+)/);
  // TEMP DEBUG — userAgentData is Chromium-only and not in this DOM lib; cast.
  const uaData = hasNavigator()
    ? (
        navigator as Navigator & {
          userAgentData?: { brands?: { brand: string; version: string }[] };
        }
      ).userAgentData
    : undefined;
  const brand = uaData?.brands?.find((b) => b.brand.includes("Chromium"));
  return {
    userAgent: ua,
    chromeVersion: brand?.version ?? chromeMatch?.[1] ?? null,
    platform: hasNavigator() ? navigator.platform : null,
    standalonePWA: hasWindow() ? window.matchMedia("(display-mode: standalone)").matches : null,
    browserTab: hasWindow() ? !window.matchMedia("(display-mode: standalone)").matches : null,
    visibilityState: hasWindow() ? document.visibilityState : null,
  };
}

/** Storage availability probes (Phase 6). */
export function debugStorageAvailability(): Record<string, unknown> {
  const probe = (storage: Storage | undefined): boolean => {
    if (!storage) return false;
    try {
      const key = "__da_probe__";
      storage.setItem(key, "1");
      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  };
  return {
    indexedDB: typeof indexedDB !== "undefined",
    localStorage: probe(hasWindow() ? window.localStorage : undefined),
    sessionStorage: probe(hasWindow() ? window.sessionStorage : undefined),
    cookieEnabled: hasNavigator() ? navigator.cookieEnabled : null,
  };
}

/** Where does Firebase actually keep the session today (Phase 6)? */
export async function debugFirebasePersistence(): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {
    indexedDBDatabases: null,
    indexedDBError: null,
    localStoredAuthKeys: null,
  };
  if (typeof indexedDB !== "undefined") {
    try {
      result.indexedDBDatabases = (await indexedDB.databases()).map((db) => db.name ?? null);
    } catch (error) {
      result.indexedDBError = String(error);
    }
  }
  if (hasWindow()) {
    try {
      result.localStoredAuthKeys = Object.keys(window.localStorage).filter((k) =>
        k.startsWith("firebase:authUser:"),
      );
    } catch {
      result.localStoredAuthKeys = null;
    }
  }
  return result;
}

/** Readable snapshot of the current Firebase Auth user (if auth exists yet). */
export function debugCurrentUser(auth: Auth | null): Record<string, unknown> {
  if (!auth) return { auth: "not-initialized", currentUser: null };
  const user = auth.currentUser;
  if (user === null) return { auth: "initialized", currentUser: null };
  return {
    auth: "initialized",
    currentUser: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      providerId: user.providerData?.[0]?.providerId ?? null,
    },
  };
}
