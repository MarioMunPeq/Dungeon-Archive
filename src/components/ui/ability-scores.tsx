import { useState } from "react";
import { abilityModifier } from "@/user-state";
import { cn } from "@/lib/utils";
import { HelpTip } from "./HelpTip";
import { InlineNumberEditor } from "./InlineNumberEditor";

export type AbilityKey =
  "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma";

const ABILITY_KEYS: readonly AbilityKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

const ABILITY_LABELS: Record<AbilityKey, string> = {
  strength: "STR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA",
};

const ABILITY_HELP: Record<AbilityKey, string> = {
  strength: "Physical power. Used for lifting, pushing, and melee attacks.",
  dexterity: "Agility and reflexes. Used for sneaking, dodging, and finesse attacks.",
  constitution: "Toughness and stamina. Raises your hit points.",
  intelligence: "Reasoning and memory. Used by wizards and for knowledge checks.",
  wisdom: "Awareness and intuition. Used by clerics and for perception.",
  charisma: "Force of personality. Used for persuasion, performance, and deception.",
};

function formatSigned(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
}

function ScoreControl({
  value,
  min,
  max,
  onChange,
  label,
  compact = false,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  compact?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const applyDelta = (delta: number) => {
    onChange(Math.max(min, Math.min(max, value + delta)));
  };

  const commitDraft = () => {
    const parsed = Math.floor(Number(draft.trim()));
    if (Number.isFinite(parsed)) onChange(Math.max(min, Math.min(max, parsed)));
    setEditing(false);
  };

  const stepClass = cn(
    "hitbox-expand flex shrink-0 select-none items-center justify-center rounded-control text-muted-foreground transition-all duration-150 active:scale-90 hover:text-foreground disabled:cursor-default disabled:text-disabled-foreground disabled:active:scale-100",
    compact ? "h-5 w-5" : "h-6 w-6",
  );

  const iconClass = compact ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {editing ? (
        <InlineNumberEditor
          value={draft}
          onChange={setDraft}
          onSave={commitDraft}
          onCancel={() => setEditing(false)}
          ariaLabel={`Edit ${label}`}
          className={cn(
            "px-1 text-center font-mono",
            compact ? "h-5 w-10 text-[11px]" : "h-6 w-12 text-xs",
          )}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setDraft(String(value));
            setEditing(true);
          }}
          aria-label={`Edit ${label}`}
          className={cn(
            "flex items-center justify-center rounded-control px-1 font-mono font-medium text-foreground-subtle transition-colors duration-150 hover:bg-accent/60",
            compact ? "h-5 min-w-4 text-[11px]" : "h-6 min-w-5 text-xs",
          )}
        >
          {value}
        </button>
      )}
      <button
        type="button"
        onClick={() => applyDelta(-1)}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
        className={stepClass}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className={iconClass}
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => applyDelta(1)}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
        className={stepClass}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className={iconClass}
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}

export interface AbilityScoresProps {
  readonly scores: Record<AbilityKey, number>;
  readonly onChange?: (key: AbilityKey, value: number) => void;
  readonly columns?: 2 | 3;
}

export function AbilityScores({ scores, onChange, columns = 2 }: AbilityScoresProps) {
  const compact = columns === 3;
  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-3" : "grid-cols-2")}>
      {ABILITY_KEYS.map((key) => {
        const score = scores[key];
        const modifier = abilityModifier(score);
        return (
          <div
            key={key}
            className={cn(
              "flex min-w-0 items-center gap-1.5 rounded-card border border-border-amber bg-surface readout-card px-2.5 py-2",
              compact && "flex-col gap-1 px-1.5 py-1.5",
            )}
          >
            <span
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs font-semibold uppercase text-muted-foreground",
                compact ? "tracking-normal" : "tracking-wide",
              )}
            >
              {ABILITY_LABELS[key]}
              <HelpTip label={`What is ${ABILITY_LABELS[key]}?`}>{ABILITY_HELP[key]}</HelpTip>
            </span>
            <span className={cn("flex items-center", compact ? "gap-1" : "gap-1.5")}>
              <span
                className={cn(
                  "shrink-0 font-mono font-bold tabular-nums leading-none",
                  compact ? "text-sm" : "text-lg",
                  modifier > 0 ? "text-success" : modifier < 0 ? "text-destructive" : "text-gold",
                )}
              >
                {formatSigned(modifier)}
              </span>
              {onChange ? (
                <ScoreControl
                  value={score}
                  min={1}
                  max={30}
                  onChange={(value) => onChange(key, value)}
                  label={ABILITY_LABELS[key]}
                  compact={compact}
                />
              ) : (
                <span
                  className={cn(
                    "shrink-0 font-mono font-medium tabular-nums text-foreground-subtle",
                    compact ? "text-[11px]" : "text-xs",
                  )}
                >
                  {score}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
