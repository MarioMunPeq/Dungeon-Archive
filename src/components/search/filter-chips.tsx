import { cn } from "@/lib/utils";

interface FilterChipOption {
  readonly value: string;
  readonly label: string;
}

interface FilterChipsProps {
  readonly options: readonly FilterChipOption[];
  readonly selected: string;
  readonly onChange: (value: string) => void;
  readonly ariaLabel?: string;
  readonly wrap?: boolean;
  readonly className?: string;
}

const CHIP_BASE =
  "inline-flex shrink-0 items-center rounded-control border px-3 py-1 text-xs transition-all duration-150 active:scale-95";
const CHIP_ACTIVE = "border-foreground bg-accent font-medium text-foreground";
const CHIP_INACTIVE = "border-border text-muted-foreground hover:bg-accent hover:text-foreground";

export function FilterChips({
  options,
  selected,
  onChange,
  ariaLabel,
  wrap = false,
  className,
}: FilterChipsProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex gap-2", wrap ? "flex-wrap" : "overflow-x-auto", className)}
    >
      {options.map((option) => {
        const active = selected === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(active ? "" : option.value)}
            aria-pressed={active}
            className={cn(CHIP_BASE, active ? CHIP_ACTIVE : CHIP_INACTIVE)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
