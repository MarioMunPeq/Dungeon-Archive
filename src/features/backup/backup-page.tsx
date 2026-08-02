import { useCallback, useEffect, useState } from "react";
import { Button, Inline, Section, Surface } from "@/components/ui";
import { getGateway, restore, upload } from "@/sync";
import type { CloudGateway, CloudUser } from "@/sync";

const LAST_UPLOAD_KEY = "dungeon:backup:lastUpload:v1";

interface LastUpload {
  readonly uid: string;
  readonly at: number;
}

function readLastUpload(): LastUpload | null {
  try {
    const raw = localStorage.getItem(LAST_UPLOAD_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw) as { uid?: unknown; at?: unknown };
    if (typeof parsed.uid !== "string" || typeof parsed.at !== "number") return null;
    return { uid: parsed.uid, at: parsed.at };
  } catch {
    return null;
  }
}

function writeLastUpload(uid: string, at: number): void {
  try {
    localStorage.setItem(LAST_UPLOAD_KEY, JSON.stringify({ uid, at }));
  } catch {
    // storage is best-effort; the backup itself already succeeded
  }
}

function formatTimestamp(at: number): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(at));
}

type Operation = "signIn" | "signOut" | "upload" | "restore";

function operationMessage(op: Operation): string {
  switch (op) {
    case "signIn":
      return "Unable to sign in.";
    case "signOut":
      return "Unable to sign out.";
    case "upload":
      return "Unable to upload backup.";
    case "restore":
      return "Unable to restore backup.";
  }
}

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

interface ConfirmDialogProps {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel: string;
  readonly destructive: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  destructive,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
    >
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-card p-5 shadow-lg animate-slide-up">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
        <Inline gap="sm" className="w-full justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={destructive ? "danger-solid" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Inline>
      </div>
    </div>
  );
}

export function BackupPage() {
  const gateway = useGateway();
  const online = useOnline();
  const [user, setUser] = useState<CloudUser | null>(null);
  const [busy, setBusy] = useState<Operation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<"upload" | "restore" | null>(null);
  const [lastUpload, setLastUpload] = useState<LastUpload | null>(() => readLastUpload());

  useEffect(() => {
    if (gateway === null) return;
    return gateway.onAuthChange((next) => setUser(next));
  }, [gateway]);

  const run = useCallback(
    async (op: Operation, fn: () => Promise<void>) => {
      setError(null);
      setBusy(op);
      try {
        await fn();
      } catch {
        setError(online ? operationMessage(op) : "Connection failed.");
      } finally {
        setBusy(null);
      }
    },
    [online],
  );

  const handleSignIn = useCallback(() => {
    if (gateway === null) return;
    void run("signIn", () => gateway.signIn().then(() => undefined));
  }, [gateway, run]);

  const handleSignOut = useCallback(() => {
    if (gateway === null) return;
    void run("signOut", () => gateway.signOut());
  }, [gateway, run]);

  const handleConfirm = useCallback(
    async (kind: "upload" | "restore") => {
      setConfirm(null);
      if (kind === "upload") {
        if (user === null) return;
        await run("upload", async () => {
          await upload();
          writeLastUpload(user.uid, Date.now());
          setLastUpload(readLastUpload());
        });
      } else {
        await run("restore", () => restore());
      }
    },
    [run, user],
  );

  const ready = gateway !== null;
  const signedIn = user !== null;
  const canAct = online && busy === null;
  const lastCloudBackup =
    signedIn && lastUpload !== null && lastUpload.uid === user.uid ? lastUpload.at : null;

  return (
    <div className="flex flex-col px-4 py-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-xl font-bold text-foreground">Cloud Backup</h1>
        <p className="text-xs text-muted-foreground">
          Your data is stored locally on this device. Cloud backup is completely optional and
          allows you to restore your data on another device.
        </p>
        {!online && <p className="text-xs font-medium text-warning">You are currently offline.</p>}
      </div>

      {ready && (
        <div className="flex flex-col gap-8">
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
                  {!signedIn && error && (
                    <p role="alert" className="text-xs font-medium text-destructive">
                      {error}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm text-foreground">
                    {user.email ?? user.displayName ?? "Signed in"}
                  </p>
                  <Button variant="outline" size="sm" onClick={handleSignOut} disabled={!canAct}>
                    {busy === "signOut" ? "Signing out…" : "Sign out"}
                  </Button>
                </div>
              )}
            </Surface>
          </Section>

          {signedIn && (
            <Section title="Backup">
              <Surface>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">Last cloud backup</span>
                  <span className="text-sm font-medium text-foreground">
                    {lastCloudBackup !== null ? formatTimestamp(lastCloudBackup) : "No backup found."}
                  </span>
                </div>
              </Surface>
              <div className="flex flex-col gap-2">
                <Button onClick={() => setConfirm("upload")} disabled={!canAct}>
                  {busy === "upload" ? "Uploading…" : "Upload backup"}
                </Button>
                <Button variant="outline" onClick={() => setConfirm("restore")} disabled={!canAct}>
                  {busy === "restore" ? "Restoring…" : "Restore backup"}
                </Button>
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

      {confirm === "upload" && (
        <ConfirmDialog
          title="Upload backup?"
          message="This will replace the current cloud backup."
          confirmLabel="Upload"
          destructive={false}
          onCancel={() => setConfirm(null)}
          onConfirm={() => void handleConfirm("upload")}
        />
      )}
      {confirm === "restore" && (
        <ConfirmDialog
          title="Restore backup?"
          message="This will replace your current local data with the backup stored in the cloud."
          confirmLabel="Restore"
          destructive
          onCancel={() => setConfirm(null)}
          onConfirm={() => void handleConfirm("restore")}
        />
      )}
    </div>
  );
}
