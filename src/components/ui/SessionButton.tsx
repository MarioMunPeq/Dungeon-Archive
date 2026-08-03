import { memo, useRef, useState } from "react";
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

export const SessionButton = memo(function SessionButton({
  canonicalId,
  className = "",
}: SessionButtonProps) {
  const inSession = useIsInSession(canonicalId);
  const [feedback, setFeedback] = useState<"added" | "removed" | null>(null);
  const feedbackTimer = useRef<number | undefined>(undefined);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    const next = !inSession;
    userStore.getState().toggleSession(canonicalId);
    setFeedback(next ? "added" : "removed");
    window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setFeedback(null), 900);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={inSession ? "Unpin from session" : "Pin to session"}
      className={`hitbox-expand inline-flex items-center justify-center rounded-lg p-1.5 transition-all duration-150 hover:bg-accent active:scale-90 active:bg-accent/80 ${className} ${
        inSession ? "text-info" : "text-muted-foreground"
      }`}
      aria-label={inSession ? "Unpin from session" : "Pin to session"}
    >
      <span key={feedback ?? "static"} className={feedback === "added" ? "animate-pop" : undefined}>
        <PinIcon filled={inSession} />
      </span>
      {feedback && (
        <span
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-border bg-card px-2 py-0.5 text-xs font-medium text-foreground shadow-md animate-slide-up"
          role="status"
        >
          {feedback === "added" ? "Pinned" : "Removed"}
        </span>
      )}
    </button>
  );
});
