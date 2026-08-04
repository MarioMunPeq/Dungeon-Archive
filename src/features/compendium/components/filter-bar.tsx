import { useState } from "react";
import type { FilterDefinition } from "@/compendium";
import { SelectField } from "@/components/ui/SelectField";
import { Button } from "@/components/ui/Button";

interface FilterBarProps {
  readonly filters: readonly FilterDefinition[];
  readonly values: Record<string, string>;
  readonly onChange: (key: string, value: string) => void;
}

export function FilterBar({ filters, values, onChange }: FilterBarProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  if (filters.length === 0) return null;

  const primary = filters[0]!;
  const advanced = filters.slice(1);
  const hasAdvanced = advanced.length > 0;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          filter={primary}
          value={values[primary.key] ?? ""}
          onChange={onChange}
        />
        {hasAdvanced && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAdvancedOpen((open) => !open)}
            aria-expanded={advancedOpen}
            aria-controls="advanced-filters"
          >
            {advancedOpen ? "Less filters" : "More filters"}
          </Button>
        )}
      </div>
      {hasAdvanced && advancedOpen && (
        <div id="advanced-filters" className="mt-3 flex flex-wrap gap-3">
          {advanced.map((filter) => (
            <FilterSelect
              key={filter.key}
              filter={filter}
              value={values[filter.key] ?? ""}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  filter,
  value,
  onChange,
}: {
  readonly filter: FilterDefinition;
  readonly value: string;
  readonly onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-muted-foreground">{filter.label}</label>
      <SelectField
        value={value}
        options={filter.options}
        onChange={(next) => onChange(filter.key, next)}
        ariaLabel={filter.label}
      />
    </div>
  );
}
