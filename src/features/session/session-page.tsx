import { useState, useCallback } from "react";
import { Link } from "react-router";
import { useSessionIds, userStore } from "@/user-state";
import { CATEGORY_REGISTRY, formatSource, slugFromCanonicalId, getEntity } from "@/compendium";
import type { EntityCategory } from "@/compendium";
import { Badge } from "@/components/ui/Badge";

const BADGE_VARIANT: Record<string, "default" | "accent" | "outline" | "subtle"> = {
  spell: "default",
  monster: "accent",
  equipment: "outline",
  magicitem: "accent",
  feat: "subtle",
  condition: "outline",
  action: "subtle",
};

interface SessionEntry {
  canonicalId: string;
  category: EntityCategory;
  name: string;
  source: string;
  href: string;
}

function entryFromCanonicalId(id: string): SessionEntry | null {
  const dot = id.indexOf(".");
  if (dot === -1) return null;
  const category = id.substring(0, dot) as EntityCategory;
  const entityId = id.substring(dot + 1);
  const entity = getEntity(category, entityId);
  if (!entity) return null;
  return {
    canonicalId: id,
    category,
    name: entity.name,
    source: entity.source,
    href: `/${category}/${slugFromCanonicalId(id)}`,
  };
}

export function SessionPage() {
  const sessionIds = useSessionIds();
  const [showConfirm, setShowConfirm] = useState(false);

  const entries: SessionEntry[] = [];
  for (const id of sessionIds) {
    const entry = entryFromCanonicalId(id);
    if (entry) entries.push(entry);
  }

  const handleClearSession = useCallback(() => {
    userStore.getState().clearSession();
    setShowConfirm(false);
  }, []);

  const handleShowConfirm = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleCancelConfirm = useCallback(() => {
    setShowConfirm(false);
  }, []);

  const handleRemove = useCallback((canonicalId: string) => {
    userStore.getState().toggleSession(canonicalId);
  }, []);

  return (
    <div className="flex flex-col px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Session</h1>
          <p className="text-xs text-muted-foreground">
            {sessionIds.length === 0
              ? "No entities in session"
              : `${sessionIds.length} entr${sessionIds.length === 1 ? "y" : "ies"}`}
          </p>
        </div>
        {showConfirm ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancelConfirm}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-150 hover:bg-accent active:scale-90"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleClearSession}
              className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-all duration-150 hover:bg-destructive/90 active:scale-90"
            >
              End
            </button>
          </div>
        ) : (
          sessionIds.length > 0 && (
            <button
              type="button"
              onClick={handleShowConfirm}
              className="rounded-lg border border-destructive/50 px-3 py-1.5 text-xs text-destructive transition-all duration-150 hover:bg-destructive/10 active:scale-90"
            >
              End Session
            </button>
          )
        )}
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Session is empty. Search for entities and pin what you need for your encounter.
          </p>
          <Link
            to="/search"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-95"
          >
            Search
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          {entries.map((entry) => {
            const variant = BADGE_VARIANT[entry.category] ?? "default";
            const cat = CATEGORY_REGISTRY[entry.category];
            return (
              <Link
                key={entry.canonicalId}
                to={entry.href}
                className="flex items-center gap-3 border-b border-border px-0 py-3 transition-all duration-150 hover:bg-accent/50 active:bg-accent/80"
              >
                <Badge variant={variant} className="shrink-0">
                  {cat.singular}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{entry.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{formatSource(entry.source)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove(entry.canonicalId);
                  }}
                  className="hitbox-expand inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
                  aria-label={`Remove ${entry.name} from session`}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
