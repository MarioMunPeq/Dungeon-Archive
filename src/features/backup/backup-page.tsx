import { useCallback, useEffect, useState } from "react";
import {
  Button,
  ConfirmDialog,
  Inline,
  Section,
  Skeleton,
  Surface,
  useSnackbar,
} from "@/components/ui";
import {
  getBackupStatus,
  friendlyErrorMessage,
  restore,
  upload,
  useCloudStatus,
  useCloudSync,
} from "@/sync";
import type { CloudSnapshot } from "@/sync";
import { t } from "@/i18n";
import { useLanguage, userStore } from "@/user-state";
import type { UserState } from "@/user-state";
import { InstallAppSection } from "./install-app";

type Operation = "signIn" | "signOut" | "upload" | "restore";

/**
 * Formatters are locale-aware so Spanish speakers get "14 de marzo de 2026,
 * 18:04" instead of an anglicized "Mar 14, 2026". They are built per call
 * because the locale follows the chosen language rather than the browser.
 */
function formatTimestamp(at: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(at),
  );
}

function formatRelative(at: number, locale: string, now = Date.now()): string {
  const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(
    new Date(at),
  );
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const startOfDay = new Date(at).setHours(0, 0, 0, 0);
  const days = Math.round((startOfToday - startOfDay) / 86400000);
  if (days === 0) return t("backup.todayAt", { time });
  if (days === 1) return t("backup.yesterdayAt", { time });
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(at));
}

interface PreviewCounts {
  readonly sessionCount: number;
}

function previewCounts(snapshot: CloudSnapshot): PreviewCounts {
  const meta = snapshot.metadata;
  return {
    sessionCount: meta?.sessionCount ?? snapshot.state.session.length,
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
 * The snapshot of state fields that affect the cloud comparison.
 *
 * The badge used to subscribe to the whole store and re-hash the entire
 * serialized state on *every* write — including unrelated ones like marking a
 * favourite or viewing an entity — which meant a full `JSON.stringify` plus an
 * FNV pass per write while this page was open. Subscribing to the fields that
 * actually feed the hash keeps the badge live without that cost.
 */
function useBackupRelevantState(): UserState {
  const [snapshot, setSnapshot] = useState<UserState>(() => userStore.getState());
  useEffect(() =>
    userStore.subscribe((state: UserState) => {
      setSnapshot((prev: UserState) =>
        prev.characters === state.characters &&
        prev.favorites === state.favorites &&
        prev.recentEntities === state.recentEntities &&
        prev.recentSearches === state.recentSearches &&
        prev.session === state.session &&
        prev.beginnerMode === state.beginnerMode &&
        prev.onboardingComplete === state.onboardingComplete &&
        prev.theme === state.theme &&
        prev.language === state.language &&
        prev.activeCharacterId === state.activeCharacterId
          ? prev
          : state,
      );
    }),
  );
  return snapshot;
}

export function BackupPage() {
  const { gateway, user, ready: authReady } = useCloudStatus();
  const markSyncing = useCloudSync((s) => s.markSyncing);
  const markFailed = useCloudSync((s) => s.markFailed);
  const markIdle = useCloudSync((s) => s.markIdle);
  const online = useOnline();
  const backupRelevantState = useBackupRelevantState();
  const language = useLanguage();
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
        console.error(`[backup] operation failed (${op}):`, e);
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
    void run("upload", upload, t("backup.uploaded"));
  }, [gateway, run]);

  const handleRequestRestore = useCallback(async () => {
    if (gateway === null || user === null) return;
    setError(null);
    setPreviewLoading(true);
    try {
      const snapshot = await gateway.fetchSnapshot();
      if (snapshot === null) {
        setError(t("backup.notFound"));
        return;
      }
      setPreview(snapshot);
    } catch (e) {
      console.error("[backup] restore preview failed:", e);
      setError(friendlyErrorMessage(e, online));
    } finally {
      setPreviewLoading(false);
    }
  }, [gateway, user, online]);

  const handleConfirmRestore = useCallback(() => {
    setPreview(null);
    void run("restore", restore, t("backup.restored"));
  }, [run]);

  const ready = gateway !== null;
  const disabled = gateway?.disabled === true;
  const signedIn = user !== null;
  const busyAny = busy !== null || previewLoading;
  const canAct = !busyAny;
  const status = signedIn && user !== null ? getBackupStatus(user, backupRelevantState) : null;
  const upToDate = status?.upToDate === true;
  const lastCloudBackupAt = status?.lastUpload?.at ?? null;

  return (
    <div className="flex flex-col px-4 py-6">
      <div className="mb-6 space-y-1">
        <p className="text-xs text-muted-foreground">{t("backup.intro")}</p>
      </div>

      {!ready && (
        <div role="status" className="space-y-2">
          <span className="sr-only">{t("backup.loading")}</span>
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {ready && disabled && (
        <div
          role="status"
          className="flex flex-col gap-1 rounded-card border border-border bg-muted/30 p-4"
        >
          <p className="text-sm font-semibold text-foreground">{t("backup.unavailable")}</p>
          <p className="text-xs text-muted-foreground">{t("backup.unavailableBody")}</p>
        </div>
      )}

      {ready && !disabled && !authReady && (
        <div role="status">
          <span className="sr-only">{t("backup.checkingAccount")}</span>
          <Skeleton className="h-11 w-full" />
        </div>
      )}

      {ready && !disabled && authReady && (
        <div className="flex flex-col gap-6">
          {!online && (
            <div className="flex flex-col gap-1 rounded-card border border-border bg-muted/30 p-3">
              <p className="text-sm font-semibold text-warning">{t("backup.offline")}</p>
              <p className="text-xs text-muted-foreground">{t("backup.offlineBody")}</p>
            </div>
          )}

          <Section title={t("backup.account")}>
            <Surface>
              {!signedIn ? (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-muted-foreground">{t("backup.signInBody")}</p>
                  <Inline>
                    <Button variant="outline" onClick={handleSignIn} disabled={!canAct}>
                      {busy === "signIn" ? t("backup.signingIn") : t("backup.signInWithGoogle")}
                    </Button>
                  </Inline>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm text-foreground">
                    {user.email ?? user.displayName ?? t("backup.connected")}
                  </p>
                  <Button variant="outline" size="sm" onClick={handleSignOut} disabled={!canAct}>
                    {busy === "signOut" ? t("backup.signingOut") : t("backup.signOut")}
                  </Button>
                </div>
              )}
            </Surface>
          </Section>

          {signedIn && user !== null && (
            <Section title={t("page.backup")}>
              <Surface>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">{t("backup.lastBackup")}</span>
                    <span className="text-sm font-medium text-foreground">
                      {lastCloudBackupAt !== null
                        ? formatTimestamp(lastCloudBackupAt, language)
                        : t("backup.noBackup")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">{t("backup.localData")}</span>
                    {lastCloudBackupAt !== null ? (
                      upToDate ? (
                        <span className="text-xs font-medium text-success">
                          {t("backup.upToDate")}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-warning">
                          {t("backup.outdated")}
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {t("backup.notUploaded")}
                      </span>
                    )}
                  </div>
                </div>
              </Surface>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    onClick={handleUpload}
                    disabled={!canAct || !online || upToDate}
                  >
                    {busy === "upload" ? t("backup.uploading") : t("backup.upload")}
                  </Button>
                  <p className="px-1 text-xs text-foreground-subtle">
                    {upToDate ? t("backup.alreadyUpToDate") : t("backup.uploadBody")}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    onClick={() => void handleRequestRestore()}
                    disabled={!canAct || !online}
                  >
                    {busy === "restore"
                      ? t("backup.restoring")
                      : previewLoading
                        ? t("backup.checking")
                        : t("backup.restore")}
                  </Button>
                  <p className="px-1 text-xs text-foreground-subtle">{t("backup.restoreBody")}</p>
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

      <InstallAppSection />

      {preview !== null && (
        <ConfirmDialog
          title={t("backup.restore")}
          message={t("backup.restoreWarning")}
          confirmLabel={t("backup.restore")}
          destructive
          onCancel={() => setPreview(null)}
          onConfirm={handleConfirmRestore}
        >
          {(() => {
            const counts = previewCounts(preview);
            const character = preview.state.characters[0] ?? null;
            const updated =
              typeof preview.updatedAt === "number"
                ? formatRelative(preview.updatedAt, language)
                : t("backup.unknown");
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">{t("backup.cloudCopy")}</span>
                  <span className="text-foreground">
                    {t("backup.lastUpdatedAt", { date: updated })}
                  </span>
                </div>
                <div className="space-y-1 rounded-card border border-border bg-muted/30 p-3 text-xs">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("backup.contains")}
                  </p>
                  <p className="text-foreground">
                    {character !== null
                      ? t("backup.containsCharacter", { name: character.name })
                      : t("backup.containsNoCharacter")}
                  </p>
                  <p className="text-foreground">
                    {counts.sessionCount === 1
                      ? t("backup.containsItems", { count: counts.sessionCount })
                      : t("backup.containsItemsOther", { count: counts.sessionCount })}
                  </p>
                </div>
              </div>
            );
          })()}
        </ConfirmDialog>
      )}
    </div>
  );
}
