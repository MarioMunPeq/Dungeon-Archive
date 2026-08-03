import { createContext, useContext } from "react";
import type { AuthUser } from "@/lib/firebase/auth-service";

export type AuthStatus = "loading" | "ready";

export interface AuthContextValue {
  readonly user: AuthUser | null;
  readonly status: AuthStatus;
  readonly login: () => Promise<AuthUser>;
  readonly logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return value;
}
