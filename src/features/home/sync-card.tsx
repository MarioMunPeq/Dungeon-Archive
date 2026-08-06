import { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ChevronRightIcon, Skeleton, useSnackbar } from "@/components/ui";
import { getBackupStatus, friendlyErrorMessage, getGateway } from "@/sync";
import type { CloudGateway, CloudUser } from "@/sync";
import { userStore } from "@/user-state";
import { SectionHeader } from "./section-header";

function useGateway(): CloudGateway | null {
  const [gateway, setGateway] = useState<CloudGateway | null>(null);
  useEffect(() => {
    let cancelled = false;
    void getGateway().then((next) => {
      if (!cancelled) setGateway(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return gateway;
}

function useOnline(): boolean {
  const [online, setOnline] = useState<boolean>(() => navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return online;
}

/**
 * Re-renders whenever the persisted user state changes so the current/outdated
 * sync status updates automatically (no polling).
 */
function useUserStateVersion(): void {
  const [, bump] = useReducer((n: number) => n + 1, 0);
  useEffect(() => userStore.subscribe(bump), []);
}

function formatRelative(at: number, now = Date.now()): string {
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(at));
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const startOfDay = new Date(at).setHours(0, 0, 0, 0);
  const days = Math.round((startOfToday - startOfDay) / 86400000);
  if (days === 0) return `Today ${time}`;
  if (days === 1) return `Yesterday ${time}`;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(at));
}

export function SyncCard() {
  const gateway = useGateway();
  const online = useOnline();
  useUserStateVersion();
  const { show } = useSnackbar();
  const [user, setUser] = useState<CloudUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gateway === null) return;
    return gateway.onAuthChange((next) => {
      setUser(next);
      setAuthReady(true);
    });
  }, [gateway]);

  const handleSignIn = async () => {
    if (gateway === null) return;
    setError(null);
    setBusy(true);
    try {
      const next = await gateway.signIn();
      if (next !== undefined) {
        show(`Signed in as ${next.displayName ?? next.email ?? "your Google account"}`, {
          tone: "success",
        });
      }
    } catch (e) {
      setError(friendlyErrorMessage(e, online));
    } finally {
      setBusy(false);
    }
  };

  const ready = gateway !== null && authReady;
  const signedIn = user !== null;
  const status = signedIn && user !== null ? getBackupStatus(user) : null;

  let statusText = "";
  let statusTone = "text-muted-foreground";
  if (status !== null) {
    if (status.lastUpload === null) {
      statusText = "Connected \u00b7 Not backed up yet";
    } else if (status.upToDate) {
      statusText = `Connected \u00b7 Backup current \u00b7 Synced ${formatRelative(status.lastUpload.at)}`;
      statusTone = "text-success";
    } else {
      statusText = `Connected \u00b7 Backup outdated \u00b7 Synced ${formatRelative(status.lastUpload.at)}`;
      statusTone = "text-warning";
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader title="Cloud Sync" to={signedIn ? "/backup" : undefined} />

      {!ready ? (
        <div role="status" className="space-y-1">
          <span className="sr-only">Loading sync…</span>
          <Skeleton className="h-9 w-full" />
        </div>
      ) : !signedIn ? (
        <div className="rounded-card border border-border bg-surface px-3 py-2.5">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-foreground">Cloud sync</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Sign in with Google to restore your data on another device.
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleSignIn()}
                disabled={busy}
              >
                {busy ? "Signing in\u2026" : "Sign in with Google"}
              </Button>
              {error ? <span className="text-xs text-destructive">{error}</span> : null}
            </div>
          </div>
        </div>
      ) : (
        <Link
          to="/backup"
          className="flex items-center justify-between gap-3 rounded-card border border-border bg-surface px-3 py-2.5 transition-colors hover:bg-accent active:bg-accent/80"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate text-xs font-medium text-foreground">
              {user.displayName?.trim() ? user.displayName : (user.email ?? "Google account")}
            </p>
            {user.email !== null && user.email !== user.displayName ? (
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            ) : null}
            {statusText ? <p className={`truncate text-xs ${statusTone}`}>{statusText}</p> : null}
          </div>
          <ChevronRightIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Link>
      )}
    </section>
  );
}
