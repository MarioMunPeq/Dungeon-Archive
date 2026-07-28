import { useState } from "react";
import { search } from "@/compendium";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "./components/search-input";
import { SearchResults } from "./components/search-results";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const results = search(query);

  return (
    <div>
      <SearchInput value={query} onChange={setQuery} />
      {query.trim() && results.length === 0 && <EmptyState message="No results found" />}
      {results.length > 0 && <SearchResults results={results} />}
    </div>
  );
}
