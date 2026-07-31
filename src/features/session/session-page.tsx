import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSessionIds, userStore } from "@/user-state";
import { entityRefFromCanonicalId, EntityReferenceRow, RowRemoveButton } from "@/components/entity";
import type { EntityRef } from "@/components/entity";

export function SessionPage() {
  const sessionIds = useSessionIds();
  const [showConfirm, setShowConfirm] = useState(false);

  const entries: EntityRef[] = [];
  for (const id of sessionIds) {
    const ref = entityRefFromCanonicalId(id);
    if (ref) entries.push(ref);
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
          {entries.map((ref) => (
            <EntityReferenceRow
              key={ref.canonicalId}
              canonicalId={ref.canonicalId}
              className="border-b border-border px-0 py-3"
              action={
                <RowRemoveButton
                  label={`Remove ${ref.name} from session`}
                  onClick={() => handleRemove(ref.canonicalId)}
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
