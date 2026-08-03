/**
 * Translates cloud errors into user-facing messages. Firebase messages and
 * codes never reach the UI. Unknown errors always map to a generic fallback.
 */
export function friendlyErrorMessage(error: unknown, online: boolean): string {
  if (!online) {
    return "You're offline.";
  }
  const code = (error as { code?: unknown } | null | undefined)?.code;
  if (typeof code === "string") {
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
      return "Sign in was cancelled.";
    }
    if (code === "permission-denied" || code === "firestore/permission-denied") {
      return "You don't have access to this backup.";
    }
    if (code === "auth/network-request-failed" || code.includes("unavailable")) {
      return "You're offline.";
    }
  }
  return "Something went wrong. Try again.";
}
