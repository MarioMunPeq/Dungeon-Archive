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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const { show } = useSnackbar();

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setStatus("ready");
      return;
    }
    void resolveRedirectResult()
      .then((next) => {
        if (next !== null) {
          setUser(next);
          setStatus("ready");
        }
      })
      .catch((error) => {
        setStatus("ready");
        show(friendlyErrorMessage(error, navigator.onLine), { tone: "error" });
      });
    return subscribeToAuth((next) => {
      setUser(next);
      setStatus("ready");
    });
  }, [show]);

  const value: AuthContextValue = { user, status, login: signInWithGoogle, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
