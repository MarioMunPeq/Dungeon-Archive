import type { SearchResultItem } from "@/components/entity";
import { SearchResultRow } from "./search-result-row";

interface SearchResultsProps {
  readonly results: readonly SearchResultItem[];
  readonly query: string;
  readonly selectedIndex: number;
}

export function SearchResults({ results, query, selectedIndex }: SearchResultsProps) {
  return (
    <div className="divide-y divide-border" role="listbox" aria-label="Search results">
      {results.map((result, i) => (
        <SearchResultRow
          key={result.id}
          {...result}
          query={query}
          isSelected={i === selectedIndex}
        />
      ))}
    </div>
  );
}
