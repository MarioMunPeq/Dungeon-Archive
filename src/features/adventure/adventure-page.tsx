import { useState, useCallback } from "react";
import { useActiveAdventure, useAdventureEntityIds, userStore } from "@/user-state";
import { InlineTextEditor } from "@/components/ui/InlineTextEditor";
import { InlineTextareaEditor } from "@/components/ui/InlineTextareaEditor";
import { Section } from "@/components/ui/Section";
import { Button, ConfirmDialog, Display } from "@/components/ui";
import { entityRefFromCanonicalId, EntityReferenceRow, RowRemoveButton } from "@/components/entity";
import type { EntityRef } from "@/components/entity";

export function AdventurePage() {
  const adventure = useActiveAdventure();
  const entityIds = useAdventureEntityIds();
  const allAdventures = userStore((s) => s.adventures);
  const [newObjective, setNewObjective] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [showSwitch, setShowSwitch] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleCreateAdventure = useCallback(() => {
    userStore.getState().createAdventure();
  }, []);

  const handleArchive = useCallback(() => {
    if (adventure) {
      userStore.getState().archiveAdventure(adventure.id);
    }
  }, [adventure]);

  const handleToggleSwitch = useCallback(() => {
    setShowSwitch((v) => !v);
  }, []);

  const handleSelectAdventure = useCallback((id: string) => {
    userStore.getState().setActiveAdventure(id);
    setShowSwitch(false);
  }, []);

  const handleToggleEntity = useCallback((canonicalId: string) => {
    userStore.getState().toggleAdventureEntity(canonicalId);
  }, []);

  const handleClearEntities = useCallback(() => {
    userStore.getState().clearAdventureEntities();
    setShowClearConfirm(false);
  }, []);

  const handleAddObjective = useCallback(() => {
    if (!adventure || !newObjective.trim()) return;
    userStore.getState().addObjective(adventure.id, newObjective.trim());
    setNewObjective("");
  }, [adventure, newObjective]);

  const handleRemoveObjective = useCallback(
    (index: number) => {
      if (adventure) {
        userStore.getState().removeObjective(adventure.id, index);
      }
    },
    [adventure],
  );

  const handleStartTitleEdit = useCallback(() => {
    if (adventure) {
      setTitleDraft(adventure.title);
      setEditingTitle(true);
    }
  }, [adventure]);

  const handleSaveTitle = useCallback(
    (value: string) => {
      if (adventure && value.trim()) {
        userStore.getState().updateAdventure(adventure.id, { title: value.trim() });
      }
      setEditingTitle(false);
    },
    [adventure],
  );

  const handleStartDescriptionEdit = useCallback(() => {
    if (adventure) {
      setDescriptionDraft(adventure.description);
      setEditingDescription(true);
    }
  }, [adventure]);

  const handleSaveDescription = useCallback(
    (value: string) => {
      if (adventure) {
        userStore.getState().updateAdventure(adventure.id, { description: value });
      }
      setEditingDescription(false);
    },
    [adventure],
  );

  const handleStartNotesEdit = useCallback(() => {
    if (adventure) {
      setNotesDraft(adventure.notes);
      setEditingNotes(true);
    }
  }, [adventure]);

  const handleSaveNotes = useCallback(
    (value: string) => {
      if (adventure) {
        userStore.getState().updateAdventure(adventure.id, { notes: value });
      }
      setEditingNotes(false);
    },
    [adventure],
  );

  const entities: EntityRef[] = [];
  for (const id of entityIds) {
    const ref = entityRefFromCanonicalId(id);
    if (ref) entities.push(ref);
  }

  if (!adventure) {
    return (
      <div className="flex flex-col px-4 py-6">
        <Display className="mb-6">Adventure</Display>
        <div className="flex flex-col items-center gap-4 px-2 py-10 text-center">
          <p className="w-full max-w-md text-sm text-muted-foreground">
            No active adventure yet. Create one to track your campaign notes, objectives, and
            important references.
          </p>
          <Button onClick={handleCreateAdventure}>Create Adventure</Button>
        </div>
      </div>
    );
  }

  const lastUpdated = new Date(adventure.updatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <header>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {editingTitle ? (
              <InlineTextEditor
                value={titleDraft}
                onChange={setTitleDraft}
                onSave={handleSaveTitle}
                onCancel={() => setEditingTitle(false)}
                aria-label="Title"
                className="text-2xl font-bold"
              />
            ) : (
              <Display>{adventure.title}</Display>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {entities.length} reference
              {entities.length === 1 ? "" : "s"} &middot; Updated {lastUpdated}
              {adventure.archived && " \u00B7 Archived"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {!adventure.archived && !editingTitle && (
              <button
                type="button"
                onClick={handleStartTitleEdit}
                aria-label="Edit title"
                className="hitbox-expand inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4"
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
                </svg>
              </button>
            )}
            {allAdventures.length > 1 && (
              <Button variant="ghost" size="sm" onClick={handleToggleSwitch}>
                Switch
              </Button>
            )}
            {!adventure.archived && (
              <Button variant="danger" size="sm" onClick={handleArchive}>
                Archive
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3">
          {editingDescription ? (
            <InlineTextareaEditor
              value={descriptionDraft}
              onChange={setDescriptionDraft}
              onSave={handleSaveDescription}
              onCancel={() => setEditingDescription(false)}
              rows={3}
              placeholder="Add a description\u2026"
              aria-label="Description"
            />
          ) : (
            <button
              type="button"
              onClick={adventure.archived ? undefined : handleStartDescriptionEdit}
              className={`w-full rounded-lg border border-transparent px-3 py-2 text-left text-sm text-muted-foreground ${adventure.archived ? "cursor-default" : "hover:border-border hover:bg-accent/30"}`}
            >
              {adventure.description || "Add a description\u2026"}
            </button>
          )}
        </div>
      </header>

      {adventure.archived && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-accent/30 px-4 py-3">
          <p className="text-xs text-muted-foreground">This adventure is archived.</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => userStore.getState().restoreAdventure(adventure.id)}
          >
            Restore
          </Button>
        </div>
      )}

      {showSwitch && (
        <div className="overflow-hidden rounded-lg border border-border bg-surface animate-slide-down">
          <div className="border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground">
            Switch Adventure
          </div>
          {allAdventures.map((adv) => (
            <button
              key={adv.id}
              type="button"
              onClick={() => handleSelectAdventure(adv.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-accent active:bg-accent/80"
            >
              <span className="flex-1 truncate">{adv.title}</span>
              {adv.id === adventure.id && (
                <span className="text-xs font-medium text-success">Active</span>
              )}
              {adv.archived && <span className="text-xs text-foreground-subtle">Archived</span>}
            </button>
          ))}
        </div>
      )}

      <Section title="Objectives">
        {adventure.objectives.length === 0 ? (
          <p className="px-3 text-xs text-foreground-subtle">
            No objectives yet. Add the first one below.
          </p>
        ) : (
          <ul className="flex flex-col">
            {adventure.objectives.map((obj, i) => (
              <li
                key={i}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent/30"
              >
                <span className="flex-1">{obj}</span>
                {!adventure.archived && (
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(i)}
                    aria-label={`Remove objective: ${obj}`}
                    className="hitbox-expand inline-flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-4 w-4"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        {!adventure.archived && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddObjective();
              }}
              placeholder="Add objective\u2026"
              aria-label="New objective"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-focus focus:ring-1 focus:ring-focus"
            />
            <Button size="sm" onClick={handleAddObjective} disabled={!newObjective.trim()}>
              Add
            </Button>
          </div>
        )}
      </Section>

      <Section
        title="Important References"
        action={
          entities.length > 0 &&
          !adventure.archived && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => setShowClearConfirm(true)}
            >
              Remove all
            </Button>
          )
        }
      >
        {entities.length === 0 ? (
          <p className="px-3 text-xs text-foreground-subtle">
            No references yet. Use the flag icon on entity pages or search results to add them to
            this adventure.
          </p>
        ) : (
          <div className="flex flex-col">
            {entities.map((ref) => (
              <EntityReferenceRow
                key={ref.canonicalId}
                canonicalId={ref.canonicalId}
                className="border-b border-border px-0 py-3 last:border-b-0"
                action={
                  !adventure.archived && (
                    <RowRemoveButton
                      label={`Remove ${ref.name} from adventure`}
                      onClick={() => handleToggleEntity(ref.canonicalId)}
                    />
                  )
                }
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Notes" subtitle="Private notes for the DM.">
        {editingNotes ? (
          <InlineTextareaEditor
            value={notesDraft}
            onChange={setNotesDraft}
            onSave={handleSaveNotes}
            onCancel={() => setEditingNotes(false)}
            rows={6}
            placeholder="Add notes\u2026"
            aria-label="Notes"
          />
        ) : (
          <button
            type="button"
            onClick={adventure.archived ? undefined : handleStartNotesEdit}
            className={`min-h-24 w-full rounded-lg border border-transparent px-3 py-2 text-left text-sm text-muted-foreground ${adventure.archived ? "cursor-default" : "hover:border-border hover:bg-accent/30"}`}
          >
            {adventure.notes || "Add notes\u2026"}
          </button>
        )}
      </Section>

      {showClearConfirm && (
        <ConfirmDialog
          title="Remove all references?"
          message="This will remove every reference from this adventure. You can re-add them anytime."
          confirmLabel="Remove all"
          destructive
          onCancel={() => setShowClearConfirm(false)}
          onConfirm={handleClearEntities}
        />
      )}
    </div>
  );
}
