import { cn } from "@/lib/utils";
import type { CardStat } from "@/compendium";

interface EntityCardStatProps {
  readonly stat: CardStat;
}

export function EntityCardStat({ stat }: EntityCardStatProps) {
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-stat border border-gold/25 bg-gold/10 px-2 py-1">
      <span className="text-[10px] font-medium uppercase tracking-wide text-gold">
        {stat.label}
      </span>
      <span
        className={cn(
          "font-mono text-sm font-semibold leading-none text-foreground",
          stat.numeric && "tabular-nums",
        )}
      >
        {stat.value}
      </span>
    </div>
  );
}
