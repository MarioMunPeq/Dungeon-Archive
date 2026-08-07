import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import {
  resolveRedirectResult,
  signInWithGoogle,
  logout,
  subscribeToAuth,
} from "@/lib/firebase/auth-service";
import type { AuthUser } from "@/lib/firebase/auth-service";
import { useSnackbar } from "@/components/ui";
import { friendlyErrorMessage } from "@/sync/errors";
import { AuthContext } from "./auth-context";
import type { AuthContextValue, AuthStatus } from "./auth-context";
// TEMP DEBUG
import { authDebug, debugLocationSnapshot } from "@/lib/firebase/auth-debug";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const { show } = useSnackbar();

  useEffect(() => {
    // TEMP DEBUG — Phase 5: bracket the provider bootstrap.
    authDebug("AUTH provider effect mount", {
      firebaseConfigured: isFirebaseConfigured(),
      ...debugLocationSnapshot(),
    });
    if (!isFirebaseConfigured()) {
      setStatus("ready");
      return;
    }
    void resolveRedirectResult()
      .then((next) => {
        if (next !== null) {
          // TEMP DEBUG — Phase 4: redirect produced a user in the provider.
          authDebug("AUTH provider: redirect user set", { uid: next.uid });
          setUser(next);
          setStatus("ready");
        }
      })
      .catch((error) => {
        // TEMP DEBUG — Phase 4: provider surfaced a redirect error snackbar.
        authDebug("AUTH provider: redirect error snackbar", {
          message: (error as { message?: unknown })?.message,
          full: error,
        });
        setStatus("ready");
        show(friendlyErrorMessage(error, navigator.onLine), { tone: "error" });
      });
    return subscribeToAuth((next) => {
      // TEMP DEBUG — Phase 5: provider applied an observer user change.
      authDebug("AUTH provider: observer user set", { uid: next?.uid ?? null });
      setUser(next);
      setStatus("ready");
    });
  }, [show]);

  const value: AuthContextValue = { user, status, login: signInWithGoogle, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
