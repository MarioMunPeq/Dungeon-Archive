import { useState, useCallback, type FormEvent } from "react";
import { useActiveAdventure, userStore } from "@/user-state";

interface SceneTargetSheetProps {
  readonly canonicalId: string;
  readonly onClose: () => void;
}

export function SceneTargetSheet({ canonicalId, onClose }: SceneTargetSheetProps) {
  const activeAdventure = useActiveAdventure();
  const [newTitle, setNewTitle] = useState("");

  const handleCreateAdventure = useCallback(() => {
    userStore.getState().createAdventure();
  }, []);

  const handleAddToScene = useCallback(
    (sceneId: string) => {
      if (!activeAdventure) return;
      const scene = activeAdventure.scenes.find((s) => s.id === sceneId);
      if (scene && !scene.entities.includes(canonicalId)) {
        userStore.getState().toggleSceneEntity(activeAdventure.id, sceneId, canonicalId);
      }
      onClose();
    },
    [activeAdventure, canonicalId, onClose],
  );

  const handleNewScene = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!activeAdventure || !newTitle.trim()) return;
      const sceneId = userStore.getState().addScene(activeAdventure.id, { title: newTitle.trim() });
      if (sceneId) {
        userStore.getState().toggleSceneEntity(activeAdventure.id, sceneId, canonicalId);
      }
      onClose();
    },
    [activeAdventure, newTitle, canonicalId, onClose],
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <h2 className="flex-1 text-sm font-semibold text-foreground">Add to Scene</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="hitbox-expand inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {!activeAdventure ? (
        <div className="flex flex-col items-center gap-4 px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Scenes live inside an adventure. Create one to start organizing scenes.
          </p>
          <button
            type="button"
            onClick={handleCreateAdventure}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-95"
          >
            Create Adventure
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-8 pt-3">
          <form onSubmit={handleNewScene} className="mb-4 flex items-center gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New scene title\u2026"
              autoComplete="off"
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-95 disabled:opacity-40"
            >
              Add
            </button>
          </form>

          <p className="mb-1 text-xs font-medium text-muted-foreground">Scenes in {activeAdventure.title}</p>
          {activeAdventure.scenes.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-foreground-subtle">
              No scenes yet. Create one above, or tap the flag to add to this adventure directly.
            </p>
          ) : (
            <ul>
              {activeAdventure.scenes.map((scene) => {
                const present = scene.entities.includes(canonicalId);
                const label = (
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">{scene.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {scene.entities.length} reference{scene.entities.length === 1 ? "" : "s"}
                    </span>
                  </span>
                );
                if (present) {
                  return (
                    <li key={scene.id}>
                      <div className="flex w-full items-center gap-3 border-b border-border py-3">
                        {label}
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-success">
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Added
                        </span>
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={scene.id}>
                    <button
                      type="button"
                      onClick={() => handleAddToScene(scene.id)}
                      className="flex w-full items-center gap-3 border-b border-border py-3 text-left transition-all duration-150 hover:bg-accent/50 active:bg-accent/80"
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
