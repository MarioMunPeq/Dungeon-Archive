import type { ChangeEvent } from "react";
import type { FilterDefinition } from "@/compendium";

interface FilterBarProps {
  readonly filters: readonly FilterDefinition[];
  readonly values: Record<string, string>;
  readonly onChange: (key: string, value: string) => void;
}

export function FilterBar({ filters, values, onChange }: FilterBarProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">{filter.label}</label>
          <select
            value={values[filter.key] ?? ""}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              onChange(filter.key, e.currentTarget.value);
            }}
            className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
