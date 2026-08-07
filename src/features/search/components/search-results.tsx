import type { SearchResultItem } from "@/components/entity";
import { VirtualList } from "@/components/virtual";
import { SearchResultRow } from "./search-result-row";

interface SearchResultsProps {
  readonly results: readonly SearchResultItem[];
  readonly query: string;
  readonly selectedIndex: number;
}

export function SearchResults({ results, query, selectedIndex }: SearchResultsProps) {
  return (
    <VirtualList
      id="search-results-listbox"
      role="listbox"
      ariaLabel="Search results"
      items={results}
      getItemKey={(result) => result.id}
      estimateRowHeight={56}
      divide
      renderItem={(result, index) => (
        <SearchResultRow
          {...result}
          query={query}
          isSelected={index === selectedIndex}
          id={`search-result-${index}`}
        />
      )}
    />
  );
}
