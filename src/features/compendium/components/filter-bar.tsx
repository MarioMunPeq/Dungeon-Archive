import { useState } from "react";
import type { FilterDefinition } from "@/compendium";
import { Button } from "@/components/ui/Button";
import { FilterGroup, FilterSheet } from "./filter-sheet";

interface FilterBarProps {
  readonly filters: readonly FilterDefinition[];
  readonly values: Record<string, string>;
  readonly onChange: (key: string, value: string) => void;
}

export function FilterBar({ filters, values, onChange }: FilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  if (filters.length === 0) return null;

  const primary = filters[0]!;
  const hasAdvanced = filters.length > 1;

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <FilterGroup
          filter={primary}
          value={values[primary.key] ?? ""}
          onChange={onChange}
          wrap={false}
        />
        {hasAdvanced && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
          >
            More filters
          </Button>
        )}
      </div>
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
