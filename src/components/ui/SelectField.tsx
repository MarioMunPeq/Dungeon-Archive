import type { ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface SelectFieldProps {
  readonly value: string;
  readonly options: readonly string[];
  readonly onChange: (value: string) => void;
  readonly ariaLabel: string;
  readonly placeholder?: string;
  readonly className?: string;
}

export function SelectField({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = "",
  className = "",
}: SelectFieldProps) {
  const showCurrent = value !== "" && !options.includes(value);
  return (
    <select
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.currentTarget.value)}
      aria-label={ariaLabel}
      className={cn(
        "h-9 max-w-full cursor-pointer appearance-none rounded-md border border-border bg-background px-2 pr-7 text-sm text-foreground outline-none transition-colors duration-100 focus:border-focus focus:ring-1 focus:ring-focus",
        !value && "text-muted-foreground",
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239497a1' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.5rem center",
        backgroundSize: "1rem",
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {showCurrent && <option value={value}>{value}</option>}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
