import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import type { Unsubscribe } from "firebase/auth";
import { getAuthInstance, getGoogleProvider } from "./auth";
// TEMP DEBUG
import { authDebug, debugLocationSnapshot, debugViteEnv } from "./auth-debug";

export interface AuthUser {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
}

function toAuthUser(user: {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
}): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

function requireAuth() {
  const auth = getAuthInstance();
  if (auth === null) {
    throw new Error("Firebase is not configured");
  }
  return auth;
}

function isProductionBuild(): boolean {
  try {
    return import.meta.env.PROD === true;
  } catch {
    return false;
  }
}

// TEMP DEBUG — Phase 5: tracks whether getRedirectResult() has settled yet, so
// observer callbacks can say whether they fired before or after the redirect.
let redirectResultSettled = false;

export function signInWithGoogle(): Promise<AuthUser | void> {
  const auth = requireAuth();
  const provider = getGoogleProvider();
  // TEMP DEBUG — Phase 2 + 8: prove which flow runs on the deployed build.
  const env = debugViteEnv();
  authDebug("AUTH start signInWithGoogle", {
    env,
    isProductionBuild: isProductionBuild(),
    ...debugLocationSnapshot(),
  });
  if (isProductionBuild()) {
    // TEMP DEBUG — Phase 2: redirect branch executed.
    authDebug("AUTH FLOW → Redirect", env);
    return signInWithRedirect(auth, provider);
  }

  // TEMP DEBUG — Phase 2: popup branch executed.
  authDebug("AUTH FLOW → Popup", env);
  return signInWithPopup(auth, provider).then(
    (result) => {
      // TEMP DEBUG — Phase 8: popup finished.
      authDebug("AUTH popup finished", {
        uid: result.user.uid,
        email: result.user.email,
        ...debugLocationSnapshot(),
      });
      return toAuthUser(result.user);
    },
    (error) => {
      // TEMP DEBUG — Phase 8: popup failed. Full error printed, not swallowed.
      authDebug("AUTH popup failed", {
        name: (error as { name?: unknown })?.name,
        code: (error as { code?: unknown })?.code,
        message: (error as { message?: unknown })?.message,
        full: error,
      });
      throw error;
    },
  );
}

export async function resolveRedirectResult(): Promise<AuthUser | null> {
  const auth = requireAuth();
  // TEMP DEBUG — Phase 4: time + log the redirect result lifecycle.
  // eslint-disable-next-line no-console -- TEMP DEBUG instrumentation
  console.time("Firebase Redirect Result");
  authDebug("START getRedirectResult()", {
    redirectResultSettled,
    ...debugLocationSnapshot(),
  });
  try {
    const result = await getRedirectResult(auth);
    // TEMP DEBUG — Phase 4.
    // eslint-disable-next-line no-console -- TEMP DEBUG instrumentation
    console.timeEnd("Firebase Redirect Result");
    redirectResultSettled = true;
    if (result === null) {
      // TEMP DEBUG — Phase 4: no pending redirect result.
      authDebug("NULL RESULT", {
        redirectResultSettled,
        ...debugLocationSnapshot(),
      });
      return null;
    }
    // TEMP DEBUG — Phase 4: redirect result resolved with a signed-in user.
    authDebug("SUCCESS", {
      uid: result.user.uid,
      email: result.user.email,
      providerId: result.user.providerData?.[0]?.providerId ?? null,
      displayName: result.user.displayName,
      redirectResultSettled,
      ...debugLocationSnapshot(),
    });
    return toAuthUser(result.user);
  } catch (error) {
    // TEMP DEBUG — Phase 4: ensure the timer always stops.
    // eslint-disable-next-line no-console -- TEMP DEBUG instrumentation
    console.timeEnd("Firebase Redirect Result");
    redirectResultSettled = true;
    // TEMP DEBUG — Phase 4: full error object printed, exception rethrown below.
    authDebug("ERROR", {
      name: (error as { name?: unknown })?.name,
      code: (error as { code?: unknown })?.code,
      message: (error as { message?: unknown })?.message,
      full: error,
      redirectResultSettled,
      ...debugLocationSnapshot(),
    });
    if ((error as { code?: unknown }).code === "auth/null-user") {
      return null;
    }
    throw error;
  }
}

export function logout(): Promise<void> {
  // TEMP DEBUG — Phase 8: authentication (out) start/finish.
  authDebug("AUTH logout start", debugLocationSnapshot());
  return signOut(requireAuth()).then(
    () => {
      authDebug("AUTH logout finished", debugLocationSnapshot());
    },
    (error) => {
      authDebug("AUTH logout failed", {
        name: (error as { name?: unknown })?.name,
        code: (error as { code?: unknown })?.code,
        message: (error as { message?: unknown })?.message,
        full: error,
      });
      throw error;
    },
  );
}

export function subscribeToAuth(callback: (user: AuthUser | null) => void): Unsubscribe {
  return onAuthStateChanged(requireAuth(), (user) => {
    // TEMP DEBUG — Phase 5: every observer invocation, with ordering vs redirect.
    authDebug("AUTH observer fired", {
      timestamp: new Date().toISOString(),
      url: debugLocationSnapshot().href,
      userIsNull: user === null,
      uid: user?.uid ?? null,
      email: user?.email ?? null,
      providerId: user?.providerData?.[0]?.providerId ?? null,
      displayName: user?.displayName ?? null,
      relativeToRedirectResult: redirectResultSettled ? "after" : "before",
    });
    callback(user === null ? null : toAuthUser(user));
  });
}
