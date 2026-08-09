import { useRef } from "react";
import { createPortal } from "react-dom";
import type { FilterDefinition } from "@/compendium";
import { FilterChips } from "@/components/search";
import { useDialog } from "@/components/ui/use-dialog";

interface FilterSheetProps {
  readonly filters: readonly FilterDefinition[];
  readonly values: Record<string, string>;
  readonly onChange: (key: string, value: string) => void;
  readonly onClose: () => void;
}

export function FilterSheet({ filters, values, onChange, onClose }: FilterSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useDialog({ onClose, open: true, containerRef });

  return createPortal(
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Filters"
      className="fixed inset-0 z-50 flex flex-col bg-card animate-slide-up"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <h2 className="flex-1 text-base font-semibold text-foreground">Filters</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="hitbox-expand relative inline-flex h-8 w-8 items-center justify-center rounded-control text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-10 pt-4">
        <div className="space-y-4">
          {filters.map((filter) => (
            <FilterGroup
              key={filter.key}
              filter={filter}
              value={values[filter.key] ?? ""}
              onChange={onChange}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}

interface FilterGroupProps {
  readonly filter: FilterDefinition;
  readonly value: string;
  readonly onChange: (key: string, value: string) => void;
  readonly wrap?: boolean;
}

export function FilterGroup({ filter, value, onChange, wrap = true }: FilterGroupProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{filter.label}</span>
      <FilterChips
        options={filter.options}
        selected={value}
        onChange={(next) => onChange(filter.key, next)}
        ariaLabel={filter.label}
        wrap={wrap}
      />
    </div>
  );
}
