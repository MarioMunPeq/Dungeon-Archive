import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSessionIds, userStore } from "@/user-state";
import { entityRefFromCanonicalId, EntityReferenceRow, RowRemoveButton } from "@/components/entity";
import type { EntityRef } from "@/components/entity";
import { Button, ConfirmDialog, Display } from "@/components/ui";

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

  const handleRemove = useCallback((canonicalId: string) => {
    userStore.getState().toggleSession(canonicalId);
  }, []);

  return (
    <div className="flex flex-col px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Display className="text-xl font-bold">Session</Display>
          <p className="text-xs text-muted-foreground">
            {sessionIds.length === 0
              ? "No references in session"
              : `${sessionIds.length} reference${sessionIds.length === 1 ? "" : "s"}`}
          </p>
        </div>
        {sessionIds.length > 0 && (
          <Button variant="danger" size="sm" onClick={handleShowConfirm}>
            End Session
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-2 py-10 text-center">
          <p className="w-full max-w-md text-sm text-muted-foreground">
            Session is empty. Search the Compendium and pin what you need for this session.
          </p>
          <Link
            to="/search"
            className="inline-flex touch-target items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary-hover active:scale-95 active:bg-primary-active"
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
              className="border-b border-border px-0 py-3 last:border-b-0"
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

      {showConfirm && (
        <ConfirmDialog
          title="End Session?"
          message="This will remove every reference from your session. You can re-add them anytime."
          confirmLabel="End Session"
          destructive
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleClearSession}
        />
      )}
    </div>
  );
}
