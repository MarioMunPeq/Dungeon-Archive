import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { signInWithGoogle, logout, subscribeToAuth } from "@/lib/firebase/auth-service";
import type { AuthUser } from "@/lib/firebase/auth-service";
import { AuthContext } from "./auth-context";
import type { AuthContextValue, AuthStatus } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setStatus("ready");
      return;
    }
    return subscribeToAuth((next) => {
      setUser(next);
      setStatus("ready");
    });
  }, []);

  // `login`/`logout` are stable module imports, so memoizing on the two pieces of
  // real state keeps every `useAuthContext()` consumer from re-rendering on each
  // provider render.
  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login: signInWithGoogle, logout }),
    [user, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
