import type { SearchIndexEntry } from "@/compendium";
import { SearchResultRow } from "./search-result-row";

interface SearchResultsProps {
  readonly results: readonly SearchIndexEntry[];
}

export function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="divide-y divide-border">
      {results.map((result) => (
        <SearchResultRow key={result.id} result={result} />
      ))}
    </div>
  );
}
