import { useCallback, useEffect, useReducer, useState } from "react";
import {
  Button,
  ConfirmDialog,
  Display,
  Inline,
  Section,
  Skeleton,
  Surface,
  useSnackbar,
} from "@/components/ui";
import { getBackupStatus, friendlyErrorMessage, restore, upload, useCloudStatus, useCloudSync } from "@/sync";
import type { CloudSnapshot } from "@/sync";
import { userStore } from "@/user-state";

type Operation = "signIn" | "signOut" | "upload" | "restore";

function formatTimestamp(at: number): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(at));
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

function plural(n: number, singular: string, pluralText: string): string {
  return `${n} ${n === 1 ? singular : pluralText}`;
}

interface PreviewCounts {
  readonly adventureCount: number;
  readonly playerCount: number;
  readonly favoriteCount: number;
  readonly sessionCount: number;
  readonly activeAdventureTitle: string | null;
}

function previewCounts(snapshot: CloudSnapshot): PreviewCounts {
  const meta = snapshot.metadata;
  return {
    adventureCount: meta?.adventureCount ?? snapshot.state.adventures.length,
    playerCount: meta?.playerCount ?? snapshot.state.players.length,
    favoriteCount: meta?.favoriteCount ?? snapshot.state.favorites.length,
    sessionCount: meta?.sessionCount ?? snapshot.state.session.length,
    activeAdventureTitle: meta?.activeAdventureTitle ?? null,
  };
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
 * badge updates automatically (no polling).
 */
function useUserStateVersion(): void {
  const [, bump] = useReducer((n: number) => n + 1, 0);
  useEffect(() => userStore.subscribe(bump), []);
}

export function BackupPage() {
  const { gateway, user, ready: authReady } = useCloudStatus();
  const markSyncing = useCloudSync((s) => s.markSyncing);
  const markFailed = useCloudSync((s) => s.markFailed);
  const markIdle = useCloudSync((s) => s.markIdle);
  const online = useOnline();
  useUserStateVersion();
  const { show } = useSnackbar();
  const [busy, setBusy] = useState<Operation | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CloudSnapshot | null>(null);

  const run = useCallback(
    async (op: Operation, fn: () => Promise<void>, successMessage?: string) => {
      setError(null);
      setBusy(op);
      markSyncing();
      try {
        await fn();
        markIdle();
        if (successMessage !== undefined) {
          show(successMessage, { tone: "success" });
        }
      } catch (e) {
        const message = friendlyErrorMessage(e, online);
        markFailed(message);
        setError(message);
      } finally {
        setBusy(null);
      }
    },
    [markSyncing, markFailed, markIdle, online, show],
  );

  const handleSignIn = useCallback(() => {
    if (gateway === null) return;
    void run("signIn", () => gateway.signIn().then(() => undefined));
  }, [gateway, run]);

  const handleSignOut = useCallback(() => {
    if (gateway === null) return;
    void run("signOut", () => gateway.signOut());
  }, [gateway, run]);

  const handleUpload = useCallback(() => {
    if (gateway === null) return;
    void run("upload", upload, "Backup uploaded.");
  }, [gateway, run]);

  const handleRequestRestore = useCallback(async () => {
    if (gateway === null || user === null) return;
    setError(null);
    setPreviewLoading(true);
    try {
      const snapshot = await gateway.fetchSnapshot();
      if (snapshot === null) {
        setError("No cloud backup found.");
        return;
      }
      setPreview(snapshot);
    } catch (e) {
      setError(friendlyErrorMessage(e, online));
    } finally {
      setPreviewLoading(false);
    }
  }, [gateway, user, online]);

  const handleConfirmRestore = useCallback(() => {
    setPreview(null);
    void run("restore", restore, "Backup restored.");
  }, [run]);

  const ready = gateway !== null;
  const signedIn = user !== null;
  const busyAny = busy !== null || previewLoading;
  const canAct = !busyAny;
  const status = signedIn && user !== null ? getBackupStatus(user) : null;
  const upToDate = status?.upToDate === true;
  const lastCloudBackupAt = status?.lastUpload?.at ?? null;

  return (
    <div className="flex flex-col px-4 py-6">
      <div className="mb-6 space-y-1">
        <Display>Cloud Backup</Display>
        <p className="text-xs text-muted-foreground">
          Your data lives locally on this device. Cloud backup is optional and lets you restore it
          on another device.
        </p>
      </div>

      {!ready && (
        <div role="status" className="space-y-2">
          <span className="sr-only">Loading backup…</span>
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {ready && !authReady && (
        <div role="status">
          <span className="sr-only">Checking account…</span>
          <Skeleton className="h-11 w-full" />
        </div>
      )}

      {ready && authReady && (
        <div className="flex flex-col gap-6">
          {!online && (
            <div className="flex flex-col gap-1 rounded-card border border-border bg-muted/30 p-3">
              <p className="text-sm font-semibold text-warning">Offline</p>
              <p className="text-xs text-muted-foreground">
                Cloud backup requires an internet connection.
              </p>
            </div>
          )}

          <Section title="Account">
            <Surface>
              {!signedIn ? (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-muted-foreground">
                    Sign in with Google to back up your local data.
                  </p>
                  <Inline>
                    <Button onClick={handleSignIn} disabled={!canAct}>
                      {busy === "signIn" ? "Signing in…" : "Sign in with Google"}
                    </Button>
                  </Inline>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm text-foreground">
                    {user.email ?? user.displayName ?? "Connected"}
                  </p>
                  <Button variant="outline" size="sm" onClick={handleSignOut} disabled={!canAct}>
                    {busy === "signOut" ? "Signing out…" : "Sign out"}
                  </Button>
                </div>
              )}
            </Surface>
          </Section>

          {signedIn && user !== null && (
            <Section title="Backup">
              <Surface>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Last backup</span>
                    <span className="text-sm font-medium text-foreground">
                      {lastCloudBackupAt !== null
                        ? formatTimestamp(lastCloudBackupAt)
                        : "No backup found"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">Local data</span>
                    {lastCloudBackupAt !== null ? (
                      upToDate ? (
                        <span className="text-xs font-medium text-success">Backup current</span>
                      ) : (
                        <span className="text-xs font-medium text-warning">Backup outdated</span>
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">Not uploaded yet</span>
                    )}
                  </div>
                </div>
              </Surface>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Button onClick={handleUpload} disabled={!canAct || !online || upToDate}>
                    {busy === "upload" ? "Uploading…" : "Upload backup"}
                  </Button>
                  <p className="px-1 text-xs text-foreground-subtle">
                    {upToDate
                      ? "Already up to date."
                      : "Replaces the cloud copy with your current data."}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    onClick={() => void handleRequestRestore()}
                    disabled={!canAct || !online}
                  >
                    {busy === "restore"
                      ? "Restoring…"
                      : previewLoading
                        ? "Checking…"
                        : "Restore backup"}
                  </Button>
                  <p className="px-1 text-xs text-foreground-subtle">
                    Replaces your local data with the cloud copy.
                  </p>
                </div>
              </div>
              {error && (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {error}
                </p>
              )}
            </Section>
          )}
        </div>
      )}

      {preview !== null && (
        <ConfirmDialog
          title="Restore backup"
          message="This will replace your local data."
          confirmLabel="Restore"
          destructive
          onCancel={() => setPreview(null)}
          onConfirm={handleConfirmRestore}
        >
          {(() => {
            const counts = previewCounts(preview);
            const updated =
              typeof preview.updatedAt === "number" ? formatRelative(preview.updatedAt) : "unknown";
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">Cloud backup</span>
                  <span className="text-foreground">Last updated {updated}</span>
                </div>
                <div className="space-y-1 rounded-card border border-border bg-muted/30 p-3 text-xs">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Contains
                  </p>
                  <p className="text-foreground">
                    {plural(counts.adventureCount, "adventure", "adventures")}
                  </p>
                  <p className="text-foreground">
                    {plural(counts.playerCount, "player", "players")}
                  </p>
                  <p className="text-foreground">
                    {plural(counts.favoriteCount, "favorite", "favorites")}
                  </p>
                  <p className="text-foreground">
                    {plural(counts.sessionCount, "session item", "session items")}
                  </p>
                  {counts.activeAdventureTitle !== null && (
                    <p className="text-foreground">Adventure: {counts.activeAdventureTitle}</p>
                  )}
                </div>
              </div>
            );
          })()}
        </ConfirmDialog>
      )}
    </div>
  );
}
