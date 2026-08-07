import { strictEqual } from "node:assert";
import { registerHooks } from "node:module";

// ---------------------------------------------------------------------------
// Regression guard for the production sign-in flow.
//
// Commit 61ef00a switched production login from signInWithPopup to
// signInWithRedirect. On the deployed app (github.io origin) the Firebase auth
// relay iframe (firebaseapp.com origin) has PARTITIONED storage under Chrome,
// so it cannot see the OAuth event the handler stored during the full-page
// redirect -> getRedirectResult() silently resolves null -> sign-in appeared
// broken. The popup flow does not cross that partition boundary and is the
// SDK's documented fallback. This test pins the popup flow so the regression
// cannot silently return.
// ---------------------------------------------------------------------------
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "firebase/auth") {
      return { url: new URL("./_fake-firebase-auth.ts", import.meta.url).href, shortCircuit: true };
    }
    if (specifier === "./config" && (context.parentURL ?? "").includes("src/lib/firebase/")) {
      return { url: new URL("./_fake-firebase-config.ts", import.meta.url).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

const { authCalls } = await import("./_fake-firebase-auth");
const { signInWithGoogle } = await import("../../src/lib/firebase/auth-service");

authCalls.length = 0;
const user = await signInWithGoogle();

strictEqual(user.uid, "firebase-user", "sign-in resolves with the fake user");
strictEqual(
  authCalls.includes("signInWithPopup"),
  true,
  "production login must use signInWithPopup (redirect is broken under Chrome storage partitioning)",
);
strictEqual(
  authCalls.includes("signInWithRedirect"),
  false,
  "signInWithRedirect must never run in production",
);

console.log("  \u2713 signInWithGoogle uses the popup flow and never the redirect flow");
