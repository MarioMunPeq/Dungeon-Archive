import { useState } from "react";
import type { FilterDefinition } from "@/compendium";
import { FilterChips } from "@/components/search";
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
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <FilterGroup filter={primary} value={values[primary.key] ?? ""} onChange={onChange} />
        {hasAdvanced && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={() => setAdvancedOpen((open) => !open)}
            aria-expanded={advancedOpen}
            aria-controls="advanced-filters"
          >
            {advancedOpen ? "Less filters" : "More filters"}
          </Button>
        )}
      </div>
      {hasAdvanced && advancedOpen && (
        <div id="advanced-filters" className="space-y-3">
          {advanced.map((filter) => (
            <FilterGroup
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

function FilterGroup({
  filter,
  value,
  onChange,
}: {
  readonly filter: FilterDefinition;
  readonly value: string;
  readonly onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{filter.label}</span>
      <FilterChips
        options={filter.options}
        selected={value}
        onChange={(next) => onChange(filter.key, next)}
        ariaLabel={filter.label}
        wrap
      />
    </div>
  );
}
