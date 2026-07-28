import type { SearchResultItem } from "@/components/entity";
import { SearchResultRow } from "./search-result-row";

interface SearchResultsProps {
  readonly results: readonly SearchResultItem[];
}

export function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="divide-y divide-border">
      {results.map((result) => (
        <SearchResultRow key={result.id} {...result} />
      ))}
    </div>
  );
}
