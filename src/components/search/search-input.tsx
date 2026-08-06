import { forwardRef } from "react";
import type { KeyboardEvent } from "react";
import { SearchField } from "@/components/ui/SearchField";

interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly ariaLabel: string;
  readonly placeholder?: string;
  readonly onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  readonly role?: "combobox";
  readonly ariaExpanded?: boolean;
  readonly ariaControls?: string;
  readonly activeDescendantId?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    value,
    onChange,
    ariaLabel,
    placeholder,
    onKeyDown,
    role,
    ariaExpanded,
    ariaControls,
    activeDescendantId,
  },
  ref,
) {
  return (
    <SearchField
      ref={ref}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      role={role}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-activedescendant={activeDescendantId}
      ariaLabel={ariaLabel}
    />
  );
});
