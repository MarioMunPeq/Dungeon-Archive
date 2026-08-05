import { createContext } from "react";
import type { AuthUser } from "@/lib/firebase/auth-service";

export type AuthStatus = "loading" | "ready";

export interface AuthContextValue {
  readonly user: AuthUser | null;
  readonly status: AuthStatus;
  readonly login: () => Promise<AuthUser>;
  readonly logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
