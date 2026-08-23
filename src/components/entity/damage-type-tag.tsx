import { cn } from "@/lib/utils";
import { damageTypeVisual } from "./damage-type";

interface DamageTypeTagProps {
  readonly code?: string;
  readonly className?: string;
}

/** Semantic damage-type metadata: a small identity-colored marker plus the
    plain-text label, so meaning never relies on color alone. Renders nothing
    when there is no damage type to show. */
export function DamageTypeTag({ code, className }: DamageTypeTagProps) {
  const visual = damageTypeVisual(code);
  if (!visual.label) return null;
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      {visual.dotClass && (
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", visual.dotClass)}
        />
      )}
      <span className="truncate">{visual.label}</span>
    </span>
  );
}
