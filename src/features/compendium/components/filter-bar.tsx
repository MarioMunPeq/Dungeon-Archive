import type { FilterDefinition } from "@/compendium";
import { SelectField } from "@/components/ui/SelectField";

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
          <SelectField
            value={values[filter.key] ?? ""}
            options={filter.options}
            onChange={(value) => onChange(filter.key, value)}
            ariaLabel={filter.label}
          />
        </div>
      ))}
    </div>
  );
}
