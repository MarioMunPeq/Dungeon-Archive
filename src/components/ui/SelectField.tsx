import type { ChangeEvent } from "react";
import { cn } from "@/lib/utils";

export interface SelectFieldOption {
  readonly value: string;
  readonly label: string;
}

type SelectFieldOptionInput = string | SelectFieldOption;

interface SelectFieldProps {
  readonly value: string;
  readonly options: readonly SelectFieldOptionInput[];
  readonly onChange: (value: string) => void;
  readonly ariaLabel: string;
  readonly placeholder?: string;
  readonly className?: string;
}

function normalizeOption(option: SelectFieldOptionInput): SelectFieldOption {
  return typeof option === "string" ? { value: option, label: option } : option;
}

export function SelectField({
  value,
  options,
  onChange,
  ariaLabel,
  placeholder = "",
  className = "",
}: SelectFieldProps) {
  const normalized = options.map(normalizeOption);
  const showCurrent = value !== "" && !normalized.some((o) => o.value === value);
  return (
    <select
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.currentTarget.value)}
      aria-label={ariaLabel}
      className={cn(
        "h-9 max-w-full cursor-pointer appearance-none rounded-lg border border-border bg-background px-2 pr-7 text-sm text-foreground outline-none transition-colors duration-150 focus:border-focus focus:ring-1 focus:ring-focus",
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
      {normalized.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
