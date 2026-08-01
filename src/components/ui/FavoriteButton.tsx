import { memo } from "react";
import { useIsFavorite, userStore } from "@/user-state";

interface FavoriteButtonProps {
  readonly canonicalId: string;
  readonly className?: string;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

export const FavoriteButton = memo(function FavoriteButton({
  canonicalId,
  className = "",
}: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(canonicalId);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    userStore.getState().toggleFavorite(canonicalId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`hitbox-expand inline-flex items-center justify-center rounded p-1.5 transition-all duration-150 hover:bg-accent active:scale-90 active:bg-accent/80 ${className} ${
        isFavorite ? "text-destructive" : "text-muted-foreground"
      }`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <HeartIcon filled={isFavorite} />
    </button>
  );
});
