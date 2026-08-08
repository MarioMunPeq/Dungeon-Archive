import { forwardRef } from "react";
import type { ChangeEvent, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface SearchFieldProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "className" | "type" | "value" | "onChange"
> {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly ariaLabel?: string;
  readonly className?: string;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { value, onChange, ariaLabel, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type="search"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      aria-label={ariaLabel}
      autoComplete="off"
      spellCheck={false}
      className={cn(
        "touch-target w-full rounded-control border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-150 focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus",
        className,
      )}
      {...rest}
    />
  );
});
