import { useState, useCallback, useMemo } from "react";
import { useActiveAdventure, useAdventureEntityIds, userStore } from "@/user-state";
import type { AdventureScene } from "@/user-state";
import { CATEGORY_REGISTRY, getEntitiesForCategory } from "@/compendium";
import type { EntityCategory } from "@/compendium";
import { ReferencePicker } from "@/components/ui/ReferencePicker";
import type { PickerCandidate } from "@/components/ui/ReferencePicker";
import { entityRefFromCanonicalId, EntityReferenceRow, RowRemoveButton } from "@/components/entity";
import type { EntityRef } from "@/components/entity";

function buildSceneCandidates(): PickerCandidate[] {
  const out: PickerCandidate[] = [];
  for (const category of Object.keys(CATEGORY_REGISTRY) as EntityCategory[]) {
    const reg = CATEGORY_REGISTRY[category];
    for (const entity of getEntitiesForCategory(category)) {
      out.push({
        canonicalId: entity.canonicalId,
        name: entity.name,
        subtitle: `${reg.singular} \u00B7 ${reg.getSubtitle(entity)}`,
      });
    }
  }
  return out;
}

function SceneCard({ adventureId, scene, archived }: { adventureId: string; scene: AdventureScene; archived: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(scene.title);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(scene.description ?? "");
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(scene.note ?? "");

  const candidates = useMemo(() => (pickerOpen ? buildSceneCandidates() : []), [pickerOpen]);

  const refs: EntityRef[] = [];
  for (const id of scene.entities) {
    const ref = entityRefFromCanonicalId(id);
    if (ref) refs.push(ref);
  }

  const handleStartTitleEdit = useCallback(() => {
    setTitleDraft(scene.title);
    setEditingTitle(true);
  }, [scene.title]);

  const handleSaveTitle = useCallback(() => {
    if (titleDraft.trim()) {
      userStore.getState().updateScene(adventureId, scene.id, { title: titleDraft.trim() });
    }
    setEditingTitle(false);
  }, [adventureId, scene.id, titleDraft]);

  const handleStartDescriptionEdit = useCallback(() => {
    setDescriptionDraft(scene.description ?? "");
    setEditingDescription(true);
  }, [scene.description]);

  const handleSaveDescription = useCallback(() => {
    userStore.getState().updateScene(adventureId, scene.id, { description: descriptionDraft });
    setEditingDescription(false);
  }, [adventureId, scene.id, descriptionDraft]);

  const handleStartNoteEdit = useCallback(() => {
    setNoteDraft(scene.note ?? "");
    setEditingNote(true);
  }, [scene.note]);

  const handleSaveNote = useCallback(() => {
    userStore.getState().updateScene(adventureId, scene.id, { note: noteDraft });
    setEditingNote(false);
  }, [adventureId, scene.id, noteDraft]);

  const handleRemoveScene = useCallback(() => {
    userStore.getState().removeScene(adventureId, scene.id);
  }, [adventureId, scene.id]);

  const handlePickerSelect = useCallback(
    (canonicalId: string) => {
      const state = userStore.getState();
      const adv = state.adventures.find((a) => a.id === adventureId);
      const current = adv?.scenes.find((sc) => sc.id === scene.id);
      if (adv && current && !current.entities.includes(canonicalId)) {
        userStore.getState().toggleSceneEntity(adventureId, scene.id, canonicalId);
      }
      setPickerOpen(false);
    },
    [adventureId, scene.id],
  );

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2 px-3 py-3 text-left transition-colors hover:bg-accent/30 active:bg-accent/60"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{scene.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {scene.description ? `${scene.description} \u00B7 ` : ""}
            {refs.length} reference{refs.length === 1 ? "" : "s"}
            {scene.note ? " \u00B7 DM note" : ""}
          </p>
        </div>
      </button>

      {expanded && (
        <div className="flex flex-col gap-4 border-t border-border px-3 py-3">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-xs font-medium text-muted-foreground">Title</h3>
              {!archived && !editingTitle && (
                <button
                  type="button"
                  onClick={handleStartTitleEdit}
                  className="touch-target px-2 py-1 text-xs text-muted-foreground underline transition-colors hover:text-foreground"
                >
                  Edit
                </button>
              )}
            </div>
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
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground outline-none focus:border-foreground"
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
              <p className="text-sm font-medium text-foreground">{scene.title}</p>
            )}
          </div>

          <div>
            <h3 className="mb-1 text-xs font-medium text-muted-foreground">Description</h3>
            {editingDescription ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={descriptionDraft}
                  onChange={(e) => setDescriptionDraft(e.target.value)}
                  rows={2}
                  autoFocus
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
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
              <button
                type="button"
                onClick={archived ? undefined : handleStartDescriptionEdit}
                className={`w-full rounded-lg border border-transparent px-3 py-2 text-left text-sm text-muted-foreground ${archived ? "cursor-default" : "hover:border-border hover:bg-accent/30"}`}
              >
                {scene.description || "Add a short description\u2026"}
              </button>
            )}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-xs font-medium text-muted-foreground">DM Note</h3>
              {!archived && !editingNote && scene.note && (
                <button
                  type="button"
                  onClick={handleStartNoteEdit}
                  className="touch-target px-2 py-1 text-xs text-muted-foreground underline transition-colors hover:text-foreground"
                >
                  Edit
                </button>
              )}
            </div>
            {editingNote ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  rows={2}
                  autoFocus
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-90"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingNote(false)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-150 hover:bg-accent active:scale-90"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={archived ? undefined : handleStartNoteEdit}
                className={`w-full rounded-lg border border-transparent px-3 py-2 text-left text-sm text-muted-foreground ${archived ? "cursor-default" : "hover:border-border hover:bg-accent/30"}`}
              >
                {scene.note || "Add a private DM note\u2026"}
              </button>
            )}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-xs font-medium text-muted-foreground">References</h3>
              {!archived && (
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="touch-target px-2 py-1 text-xs font-medium text-foreground underline transition-colors hover:text-primary"
                >
                  Add Reference
                </button>
              )}
            </div>
            {refs.length === 0 ? (
              <p className="px-3 text-xs text-muted-foreground/60">No references yet.</p>
            ) : (
              <div className="flex flex-col">
                {refs.map((ref) => (
                  <EntityReferenceRow
                    key={ref.canonicalId}
                    canonicalId={ref.canonicalId}
                    className="border-b border-border py-2.5"
                    action={
                      !archived && (
                        <RowRemoveButton
                          label={`Remove ${ref.name} from scene`}
                          onClick={() => userStore.getState().toggleSceneEntity(adventureId, scene.id, ref.canonicalId)}
                        />
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {!archived && (
            <button
              type="button"
              onClick={handleRemoveScene}
              className="touch-target self-start rounded-lg border border-destructive/50 px-3 py-1.5 text-xs text-destructive transition-all duration-150 hover:bg-destructive/10 active:scale-95"
            >
              Remove Scene
            </button>
          )}
        </div>
      )}

      {pickerOpen && (
        <ReferencePicker
          title="Add Reference"
          candidates={candidates}
          onSelect={handlePickerSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
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
  const [newSceneOpen, setNewSceneOpen] = useState(false);
  const [newSceneTitle, setNewSceneTitle] = useState("");

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

  const handleAddScene = useCallback(() => {
    if (!adventure || !newSceneTitle.trim()) return;
    userStore.getState().addScene(adventure.id, { title: newSceneTitle.trim() });
    setNewSceneTitle("");
    setNewSceneOpen(false);
  }, [adventure, newSceneTitle]);

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

  const entities: EntityRef[] = [];
  for (const id of entityIds) {
    const ref = entityRefFromCanonicalId(id);
    if (ref) entities.push(ref);
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
            {adventure.scenes.length} scene{adventure.scenes.length === 1 ? "" : "s"} &middot; {entities.length} entr
            {entities.length === 1 ? "y" : "ies"} &middot; Updated {lastUpdated}
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
            {entities.map((ref) => (
              <EntityReferenceRow
                key={ref.canonicalId}
                canonicalId={ref.canonicalId}
                className="border-b border-border px-0 py-3"
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
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-medium text-muted-foreground">Scenes</h2>
          {!adventure.archived && (
            <button
              type="button"
              onClick={() => setNewSceneOpen((v) => !v)}
              className="touch-target rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-150 hover:bg-accent active:scale-90"
            >
              {newSceneOpen ? "Cancel" : "Add Scene"}
            </button>
          )}
        </div>

        {newSceneOpen && (
          <div className="mb-3 flex items-center gap-2">
            <input
              type="text"
              value={newSceneTitle}
              onChange={(e) => setNewSceneTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddScene();
                if (e.key === "Escape") setNewSceneOpen(false);
              }}
              placeholder="Scene title\u2026"
              autoComplete="off"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-foreground"
            />
            <button
              type="button"
              onClick={handleAddScene}
              disabled={!newSceneTitle.trim()}
              className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-95 disabled:opacity-40"
            >
              Add
            </button>
          </div>
        )}

        {adventure.scenes.length === 0 ? (
          <p className="px-3 text-xs text-muted-foreground/60">
            Scenes are optional sections for organizing a larger adventure. Skip them, or add one to group references by chapter or location.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {adventure.scenes.map((scene) => (
              <SceneCard key={scene.id} adventureId={adventure.id} scene={scene} archived={adventure.archived} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
