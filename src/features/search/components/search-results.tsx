import type { SearchResultItem } from "@/components/entity";
import { VirtualList } from "@/components/virtual";
import { SearchResultRow } from "./search-result-row";
import { t } from "@/i18n";

interface SearchResultsProps {
  readonly results: readonly SearchResultItem[];
  readonly query: string;
  readonly selectedIndex: number;
}

export function SearchResults({ results, query, selectedIndex }: SearchResultsProps) {
  return (
    <VirtualList
      id="search-results-listbox"
      ariaLabel={t("search.resultsLabel")}
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
