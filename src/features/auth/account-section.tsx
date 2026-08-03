import { useState } from "react";
import { Button, Inline, Section, Surface } from "@/components/ui";
import { useAuth } from "./auth-context";

type Operation = "login" | "logout";

export function AccountSection() {
  const { user, status, login, logout } = useAuth();
  const [operation, setOperation] = useState<Operation | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(action: Operation, fn: () => Promise<unknown>) {
    setError(null);
    setOperation(action);
    try {
      await fn();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setOperation(null);
    }
  }

  const busy = operation !== null;

  return (
    <Section title="Account">
      <Surface>
        {status === "loading" ? (
          <p className="text-xs text-muted-foreground">Checking account…</p>
        ) : user === null ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              Sign in with Google to enable cloud features.
            </p>
            <Inline>
              <Button onClick={() => void run("login", login)} disabled={busy}>
                {operation === "login" ? "Signing in…" : "Sign in with Google"}
              </Button>
            </Inline>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 truncate text-sm text-foreground">
              {user.displayName ?? user.email ?? "Connected"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void run("logout", logout)}
              disabled={busy}
            >
              {operation === "logout" ? "Signing out…" : "Sign out"}
            </Button>
          </div>
        )}
        {error !== null && (
          <p role="alert" className="mt-3 text-xs font-medium text-destructive">
            {error}
          </p>
        )}
      </Surface>
    </Section>
  );
}
