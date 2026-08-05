import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { categoryLabelSingular, METADATA_SEPARATOR } from "@/compendium";
import type { EntityCardData } from "@/compendium";
import { useRecentEntities, useSessionIds, useActivePlayer, usePlayerReferences } from "@/user-state";
import { entityRefFromCanonicalId, EntityCard } from "@/components/entity";
import { Button } from "@/components/ui";
import { AuthContext } from "@/features/auth/auth-context";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { friendlyErrorMessage } from "@/sync/errors";

function entityCardFromCanonicalId(canonicalId: string): EntityCardData | null {
  const ref = entityRefFromCanonicalId(canonicalId);
  if (!ref) return null;
  return {
    name: ref.name,
    href: ref.href,
    categoryLabel: categoryLabelSingular(ref.category),
    metadata: ref.subtitle,
    source: ref.source,
    canonicalId: ref.canonicalId,
  };
}

function SectionHeader({ title, to }: { title: string; to?: string }) {
  const content = (
    <span className="flex items-center gap-1">
      {title}
      {to && (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-3 w-3"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </span>
  );
  return to ? (
    <Link
      to={to}
      className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
    >
      {content}
    </Link>
  ) : (
    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {content}
    </h2>
  );
}

export function HomePage() {
  const activePlayer = useActivePlayer();
  const sessionIds = useSessionIds(10);
  const recentIds = useRecentEntities(10);
  const players = usePlayerReferences();
  const auth = useContext(AuthContext);
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sessionCards: EntityCardData[] = [];
  for (const id of sessionIds) {
    const card = entityCardFromCanonicalId(id);
    if (card) sessionCards.push(card);
  }

  const recentCards: EntityCardData[] = [];
  for (const id of recentIds) {
    const card = entityCardFromCanonicalId(id);
    if (card) recentCards.push(card);
  }

  const player = activePlayer ?? players[0] ?? null;
  const firebaseEnabled = isFirebaseConfigured();
  const signedIn = auth?.user !== null && auth?.status === "ready";
  const loadingAuth = auth?.status === "loading";

  const handleSignIn = async () => {
    if (!auth) return;
    setAuthError(null);
    setBusy(true);
    try {
      await auth.login();
    } catch (error) {
      setAuthError(friendlyErrorMessage(error, navigator.onLine));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <section className="flex flex-col gap-3">
        <SectionHeader title="Current Character" to="/combat" />
        {player ? (
          <Link
            to="/combat"
            className="group flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-accent active:bg-accent/80"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{player.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {player.class ? `${player.class} ${METADATA_SEPARATOR} ` : ""}Lv {player.level}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full border border-border bg-muted px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Current
                </span>
                {signedIn && auth?.user ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-success">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
                      <path d="M17 8l4 4-4 4M7 12h14" />
                    </svg>
                    Connected
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Quick access to Combat and your current character health without duplicating HP on Home.
              </p>
              {!loadingAuth && firebaseEnabled && auth && !signedIn ? (
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleSignIn} disabled={busy}>
                    {busy ? "Signing in…" : "Sign in with Google"}
                  </Button>
                  {authError ? <span className="text-xs text-destructive">{authError}</span> : null}
                </div>
              ) : null}
            </div>
          </Link>
        ) : (
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">Create your first character</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Add a character to start tracking your party and combat state.
                </p>
              </div>
              <Link to="/party">
                <Button size="sm">Create Character</Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {firebaseEnabled && auth && !loadingAuth && !signedIn ? (
        <section className="flex flex-col gap-3">
          <div className="rounded-lg border border-border bg-surface p-3">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-foreground">Sync your character to the cloud</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Sign in with Google to restore your data on another device.
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSignIn} disabled={busy}>
                  {busy ? "Signing in…" : "Sign in with Google"}
                </Button>
                {authError ? <span className="text-xs text-destructive">{authError}</span> : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <SectionHeader title="Session" to="/session" />
        <div className="rounded-lg border border-border bg-surface p-4">
          {sessionCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {sessionCards.map((card) => (
                <EntityCard key={card.href} {...card} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">No session content yet</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Pin creatures, spells, and items to build your encounter session.
                </p>
              </div>
              <Link to="/search">
                <Button size="sm">Search the Compendium</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader title="Recently Viewed" />
        <div className="rounded-lg border border-border bg-surface p-4">
          {recentCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {recentCards.map((card) => (
                <EntityCard key={card.href} {...card} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">Nothing viewed yet</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Browse the Compendium and return here to keep recent items within reach.
                </p>
              </div>
              <Link to="/search">
                <Button size="sm">Browse the Compendium</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionHeader title="Learn the basics" to="/rules" />
        <Link
          to="/rules"
          className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:bg-accent active:bg-accent/80"
        >
          <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate text-sm font-medium text-foreground">Learn the basics</span>
            <span className="truncate text-xs text-muted-foreground">
              New to D&D? Start with the d20, checks, and your turn in combat.
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
}
