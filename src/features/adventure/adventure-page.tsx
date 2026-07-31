import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useActiveAdventure, useAdventureEntityIds, userStore } from "@/user-state";
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

interface EntityEntry {
  canonicalId: string;
  category: EntityCategory;
  name: string;
  source: string;
  href: string;
}

function entryFromCanonicalId(id: string): EntityEntry | null {
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
  }, []);

  const handleAddObjective = useCallback(() => {
    if (!adventure || !newObjective.trim()) return;
    userStore.getState().addObjective(adventure.id, newObjective.trim());
    setNewObjective("");
  }, [adventure, newObjective]);

  const handleRemoveObjective = useCallback((index: number) => {
    if (adventure) {
      userStore.getState().removeObjective(adventure.id, index);
    }
  }, [adventure]);

  const handleStartTitleEdit = useCallback(() => {
    if (adventure) {
      setTitleDraft(adventure.title);
      setEditingTitle(true);
    }
  }, [adventure]);

  const handleSaveTitle = useCallback(() => {
    if (adventure && titleDraft.trim()) {
      userStore.getState().updateAdventure(adventure.id, { title: titleDraft.trim() });
    }
    setEditingTitle(false);
  }, [adventure, titleDraft]);

  const handleStartDescriptionEdit = useCallback(() => {
    if (adventure) {
      setDescriptionDraft(adventure.description);
      setEditingDescription(true);
    }
  }, [adventure]);

  const handleSaveDescription = useCallback(() => {
    if (adventure) {
      userStore.getState().updateAdventure(adventure.id, { description: descriptionDraft });
    }
    setEditingDescription(false);
  }, [adventure, descriptionDraft]);

  const handleStartNotesEdit = useCallback(() => {
    if (adventure) {
      setNotesDraft(adventure.notes);
      setEditingNotes(true);
    }
  }, [adventure]);

  const handleSaveNotes = useCallback(() => {
    if (adventure) {
      userStore.getState().updateAdventure(adventure.id, { notes: notesDraft });
    }
    setEditingNotes(false);
  }, [adventure, notesDraft]);

  const entities: EntityEntry[] = [];
  for (const id of entityIds) {
    const entry = entryFromCanonicalId(id);
    if (entry) entities.push(entry);
  }

  if (!adventure) {
    return (
      <div className="flex flex-col px-4 py-6">
        <h1 className="mb-6 text-xl font-bold text-foreground">Adventure</h1>
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No active adventure. Create one to track your campaign notes, objectives, and important entities.
          </p>
          <button
            type="button"
            onClick={handleCreateAdventure}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-95"
          >
            Create Adventure
          </button>
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
    <div className="flex flex-col px-4 py-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") setEditingTitle(false);
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-lg font-bold text-foreground outline-none focus:border-foreground"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-90"
              >
                Save
              </button>
            </div>
          ) : (
            <h1
              className="cursor-pointer text-lg font-bold text-foreground hover:text-primary"
              onClick={handleStartTitleEdit}
              title="Click to edit title"
            >
              {adventure.title}
            </h1>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {entities.length} entr{entities.length === 1 ? "y" : "ies"} &middot; Updated {lastUpdated}
            {adventure.archived && " \u00B7 Archived"}
          </p>
        </div>
        <div className="ml-4 flex items-center gap-2">
          {allAdventures.length > 1 && (
            <button
              type="button"
              onClick={handleToggleSwitch}
              className="touch-target rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-150 hover:bg-accent active:scale-90"
            >
              Switch
            </button>
          )}
          {!adventure.archived && (
            <button
              type="button"
              onClick={handleArchive}
              className="touch-target rounded-lg border border-destructive/50 px-3 py-1.5 text-xs text-destructive transition-all duration-150 hover:bg-destructive/10 active:scale-90"
            >
              Archive
            </button>
          )}
        </div>
      </div>

      {showSwitch && (
        <div className="mb-6 overflow-hidden rounded-lg border border-border bg-background animate-slide-down">
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
                <span className="text-xs font-medium text-emerald-500">Active</span>
              )}
              {adv.archived && (
                <span className="text-xs text-muted-foreground/60">Archived</span>
              )}
            </button>
          ))}
        </div>
      )}

      {adventure.archived && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-accent/30 px-4 py-3">
          <p className="text-xs text-muted-foreground">This adventure is archived.</p>
          <button
            type="button"
            onClick={() => userStore.getState().restoreAdventure(adventure.id)}
            className="touch-target px-2 py-1 text-xs font-medium text-foreground underline transition-colors hover:text-primary"
          >
            Restore
          </button>
        </div>
      )}

      <div className="mb-6">
        <h2 className="mb-2 text-xs font-medium text-muted-foreground">Description</h2>
        {editingDescription ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={descriptionDraft}
              onChange={(e) => setDescriptionDraft(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveDescription}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-90"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingDescription(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-150 hover:bg-accent active:scale-90"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p
            className="cursor-pointer rounded-lg border border-transparent px-3 py-2 text-sm text-muted-foreground hover:border-border hover:bg-accent/30"
            onClick={handleStartDescriptionEdit}
          >
            {adventure.description || "Add a description\u2026"}
          </p>
        )}
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xs font-medium text-muted-foreground">Objectives</h2>
        {adventure.objectives.length === 0 ? (
          <p className="mb-2 px-3 text-xs text-muted-foreground/60">No objectives yet.</p>
        ) : (
          <ul className="mb-2 space-y-1">
            {adventure.objectives.map((obj, i) => (
              <li key={i} className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-foreground hover:bg-accent/30">
                <span className="flex-1">{obj}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveObjective(i)}
                  className="hitbox-expand inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90"
                  aria-label={`Remove objective: ${obj}`}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddObjective();
            }}
            placeholder="Add objective\u2026"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-foreground"
          />
          <button
            type="button"
            onClick={handleAddObjective}
            disabled={!newObjective.trim()}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-90 disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-2 text-xs font-medium text-muted-foreground">Notes</h2>
        {editingNotes ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
              rows={6}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-90"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingNotes(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-150 hover:bg-accent active:scale-90"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p
            className="min-h-[6rem] cursor-pointer rounded-lg border border-transparent px-3 py-2 text-sm text-muted-foreground hover:border-border hover:bg-accent/30"
            onClick={handleStartNotesEdit}
          >
            {adventure.notes || "Add notes\u2026"}
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-medium text-muted-foreground">Important Entities</h2>
          {entities.length > 0 && !adventure.archived && (
            <button
              type="button"
              onClick={handleClearEntities}
              className="touch-target px-2 py-1 text-xs text-destructive transition-colors hover:text-destructive/80"
            >
              Remove all
            </button>
          )}
        </div>
        {entities.length === 0 ? (
          <p className="px-3 text-xs text-muted-foreground/60">
            No entities added yet. Use the flag icon on entity pages or search results to add entities to this adventure.
          </p>
        ) : (
          <div className="flex flex-col">
            {entities.map((entry) => {
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
                  {!adventure.archived && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleEntity(entry.canonicalId);
                      }}
                      className="hitbox-expand inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
                      aria-label={`Remove ${entry.name} from adventure`}
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
