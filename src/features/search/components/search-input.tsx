import { forwardRef, type KeyboardEvent } from "react";

interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  readonly activeDescendantId?: string;
  readonly hasResults: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onChange, onKeyDown, activeDescendantId, hasResults },
  ref,
) {
  return (
    <div className="px-4 pt-4">
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search spells, equipment, conditions..."
        autoComplete="off"
        spellCheck={false}
        role="combobox"
        aria-expanded={hasResults}
        aria-haspopup="listbox"
        aria-controls="search-results-listbox"
        aria-activedescendant={activeDescendantId}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
      />
    </div>
  );
});
