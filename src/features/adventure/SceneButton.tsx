import { memo, useState, useMemo } from "react";
import { useActiveAdventure, userStore } from "@/user-state";
import { SceneTargetSheet } from "./scene-target-sheet";

interface SceneButtonProps {
  readonly canonicalId: string;
  readonly className?: string;
}

function SceneIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
    >
      <path d="M12 3 21 7l-9 4-9-4 9-4Z" />
      <path d="M3 12l9 4 9-4" />
      <path d="M3 17l9 4 9-4" />
    </svg>
  );
}

export const SceneButton = memo(function SceneButton({ canonicalId, className = "" }: SceneButtonProps) {
  const [open, setOpen] = useState(false);
  const activeAdventure = useActiveAdventure();

  const inScene = useMemo(
    () => activeAdventure?.scenes.some((sc) => sc.entities.includes(canonicalId)) ?? false,
    [activeAdventure, canonicalId],
  );

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!activeAdventure) {
      userStore.getState().createAdventure();
    }
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`hitbox-expand inline-flex items-center justify-center rounded p-1.5 transition-all duration-150 hover:bg-accent active:scale-90 active:bg-accent/80 ${className} ${
          inScene ? "text-scene" : "text-muted-foreground"
        }`}
        aria-label={inScene ? "Add to scene (already in a scene)" : "Add to scene"}
        title="Add to a scene"
      >
        <SceneIcon filled={inScene} />
      </button>
      {open && <SceneTargetSheet canonicalId={canonicalId} onClose={() => setOpen(false)} />}
    </>
  );
});
