import { memo, useState } from "react";
import { useIsInAdventure, userStore } from "@/user-state";

interface AdventureButtonProps {
  readonly canonicalId: string;
  readonly className?: string;
}

function FlagIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
    >
      <line x1="4" y1="3" x2="4" y2="21" />
      <polyline points="4 3 20 3 18 7 20 11 4 11" />
    </svg>
  );
}

export const AdventureButton = memo(function AdventureButton({
  canonicalId,
  className = "",
}: AdventureButtonProps) {
  const inAdventure = useIsInAdventure(canonicalId);
  const [pop, setPop] = useState(0);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    userStore.getState().toggleAdventureEntity(canonicalId);
    setPop((p) => p + 1);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={inAdventure ? "Remove from adventure" : "Add to adventure"}
      className={`hitbox-expand inline-flex items-center justify-center rounded-lg p-2 transition-all duration-150 hover:bg-accent active:scale-90 active:bg-accent/80 ${className} ${
        inAdventure ? "text-success" : "text-muted-foreground"
      }`}
      aria-label={inAdventure ? "Remove from adventure" : "Add to adventure"}
    >
      <span key={pop} className={pop > 0 ? "animate-pop" : undefined}>
        <FlagIcon filled={inAdventure} />
      </span>
    </button>
  );
});
