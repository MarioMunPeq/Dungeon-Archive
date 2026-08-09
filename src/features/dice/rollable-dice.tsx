import { cn } from "@/lib/utils";
import { parseDiceExpression } from "@/lib/dice";
import { useRoll } from "./use-roll";

interface RollableDiceProps {
  /** A dice expression like "1d6" or "1d4 + 1". */
  readonly expression: string;
  /** Optional trailing label like a damage type ("Acid"). */
  readonly label?: string;
  /** The static visual treatment of the text (matched to where it appears). */
  readonly className?: string;
}

/**
 * Inline, tappable dice text. Renders exactly like the static text it replaces
 * until tapped, then briefly shows the roll result: "1d6 Acid → 4".
 */
export function RollableDice({ expression, label, className }: RollableDiceProps) {
  const { rolling, display, total, roll } = useRoll();
  const parsed = parseDiceExpression(expression);

  const prefix = `${expression}${label ? ` ${label}` : ""}`;

  if (parsed === null) {
    return <span className={className}>{prefix}</span>;
  }

  const idle = !rolling && total === null;

  return (
    <button
      type="button"
      onClick={() => roll(parsed)}
      aria-label={`Roll ${prefix}`}
      className={cn(
        "inline-flex items-baseline gap-1.5 text-left transition-all duration-150 active:scale-95",
        className,
      )}
    >
      <span>{prefix}</span>
      {!idle && (
        <span className="font-mono tabular-nums" aria-live="polite">
          → {display}
        </span>
      )}
    </button>
  );
}
