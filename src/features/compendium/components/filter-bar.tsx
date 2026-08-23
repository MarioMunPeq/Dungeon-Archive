import { useState } from "react";
import type { FilterDefinition } from "@/compendium";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/icons";
import { FilterGroup, FilterSheet } from "./filter-sheet";

interface FilterBarProps {
  readonly filters: readonly FilterDefinition[];
  readonly values: Record<string, string>;
  readonly onChange: (key: string, value: string) => void;
  readonly onClearAll?: () => void;
}

export function FilterBar({ filters, values, onChange, onClearAll }: FilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  if (filters.length === 0) return null;

  const primary = filters[0]!;
  const advanced = filters.slice(1);
  const active = filters.filter((filter) => values[filter.key]);
  const advancedActiveCount = advanced.filter((filter) => values[filter.key]).length;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <FilterGroup
          filter={primary}
          value={values[primary.key] ?? ""}
          onChange={onChange}
          wrap={false}
        />
        {advanced.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
          >
            More filters
            {advancedActiveCount > 0 && (
              <span
                aria-label={`${advancedActiveCount} active`}
                className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-semibold leading-none text-primary-foreground"
              >
                {advancedActiveCount}
              </span>
            )}
          </Button>
        )}
      </div>
      {active.length > 0 && (
        <div
          role="group"
          aria-label="Active filters"
          className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 no-scrollbar"
        >
          {active.map((filter) => (
            <ActiveFilterChip
              key={filter.key}
              filter={filter}
              value={values[filter.key]!}
              onRemove={() => onChange(filter.key, "")}
            />
          ))}
          {onClearAll && (
            <Button variant="ghost" size="sm" className="shrink-0" onClick={onClearAll}>
              Clear all
            </Button>
          )}
        </div>
      )}
      {sheetOpen && (
        <FilterSheet
          filters={filters}
          values={values}
          onChange={onChange}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}

interface ActiveFilterChipProps {
  readonly filter: FilterDefinition;
  readonly value: string;
  readonly onRemove: () => void;
}

function ActiveFilterChip({ filter, value, onRemove }: ActiveFilterChipProps) {
  const label = filter.options.find((option) => option.value === value)?.label ?? value;
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${filter.label} filter: ${label}`}
      className="hitbox-expand relative inline-flex shrink-0 items-center gap-1 rounded-control border border-foreground bg-accent py-1 pl-3 pr-2 text-xs font-medium text-foreground transition-all duration-150 active:scale-95"
    >
      <span className="text-muted-foreground">{filter.label}</span>
      <span>{label}</span>
      <CloseIcon size="xs" className="text-muted-foreground" />
    </button>
  );
}
