import { memo } from "react";
import { useIsInSession, userStore } from "@/user-state";

interface SessionButtonProps {
  readonly canonicalId: string;
  readonly className?: string;
}

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
    >
      <path d="M12 2a8 8 0 00-8 8c0 5.25 8 13 8 13s8-7.75 8-13a8 8 0 00-8-8z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export const SessionButton = memo(function SessionButton({ canonicalId, className = "" }: SessionButtonProps) {
  const inSession = useIsInSession(canonicalId);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    userStore.getState().toggleSession(canonicalId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded p-1.5 transition-all duration-150 hover:bg-accent active:scale-90 active:bg-accent/80 ${className} ${
        inSession ? "text-blue-500" : "text-muted-foreground"
      }`}
      aria-label={inSession ? "In session" : "Add to session"}
    >
      <PinIcon filled={inSession} />
    </button>
  );
});
