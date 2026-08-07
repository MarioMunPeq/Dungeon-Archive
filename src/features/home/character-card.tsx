import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, ConfirmDialog } from "@/components/ui";
import { userStore } from "@/user-state";
import type { PlayerReference } from "@/user-state";

interface CharacterCardProps {
  readonly player: PlayerReference | null;
}

function classLine(player: PlayerReference): string {
  return player.class
    ? `${player.subclass ? `${player.class} (${player.subclass})` : player.class} · Lv ${player.level}`
    : `Lv ${player.level}`;
}

export function CharacterCard({ player }: CharacterCardProps) {
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  if (player === null) {
    return (
      <div className="rounded-card border border-border-amber bg-surface readout-card p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">Create your first character</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Add a character to start tracking your party and combat state.
            </p>
          </div>
          <Link to="/party" className="w-fit">
            <Button size="sm">Create Character</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-card border border-border-amber bg-surface readout-card">
      <Link
        to="/combat"
        className="flex flex-col gap-1 p-4 pr-12 transition-opacity duration-primary ease-standard hover:opacity-95 active:opacity-75"
      >
        <p className="truncate text-xl font-bold text-foreground">{player.name}</p>
        <p className="truncate text-xs text-muted-foreground">{classLine(player)}</p>
      </Link>
      <button
        type="button"
        onClick={() => setConfirmingRemove(true)}
        aria-label={`Remove ${player.name}`}
        title={`Remove ${player.name}`}
        className="hitbox-expand absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-control text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-4 w-4"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
      {confirmingRemove && (
        <ConfirmDialog
          title={`Remove ${player.name}?`}
          message="This removes the character from your party, along with their hit points and combat state. This can't be undone."
          confirmLabel="Remove"
          destructive
          onCancel={() => setConfirmingRemove(false)}
          onConfirm={() => {
            userStore.getState().removePlayerReference(player.id);
            setConfirmingRemove(false);
          }}
        />
      )}
    </div>
  );
}
