import { forwardRef } from "react";
import type { KeyboardEvent } from "react";
import { SearchField } from "@/components/ui/SearchField";

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
      <SearchField
        ref={ref}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Search spells, equipment, conditions..."
        role="combobox"
        aria-expanded={hasResults}
        aria-haspopup="listbox"
        aria-controls="search-results-listbox"
        aria-activedescendant={activeDescendantId}
        ariaLabel="Search"
      />
    </div>
  );
});
