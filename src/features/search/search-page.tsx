import { useState, useRef, useEffect, useMemo, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { search } from "@/compendium";
import { createSearchResultItems } from "@/components/entity";
import { SearchInput } from "./components/search-input";
import { SearchResults } from "./components/search-results";
import { SearchEmptyState, addRecentSearch } from "./components/search-empty-state";
import { SearchNoResults } from "./components/search-no-results";
import { SearchCategoryFilter } from "./components/search-category-filter";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const rawResults = search(query);
  const results = useMemo(
    () => createSearchResultItems(query, rawResults),
    [query, rawResults],
  );

  const filtered = useMemo(() => {
    if (!categoryFilter) return results;
    return results.filter((r) => r.category === categoryFilter);
  }, [results, categoryFilter]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, categoryFilter]);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Escape":
        if (query) {
          setQuery("");
          e.preventDefault();
        }
        break;
      case "Enter": {
        e.preventDefault();
        const target = selectedIndex >= 0 ? filtered[selectedIndex] : filtered[0];
        if (target) {
          addRecentSearch(query);
          navigate(target.to);
        }
        break;
      }
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
    }
  }

  const hasQuery = query.trim().length > 0;
  const hasResults = filtered.length > 0;

  return (
    <div className="flex flex-col pb-4">
      <SearchInput
        ref={inputRef}
        value={query}
        onChange={setQuery}
        onKeyDown={handleKeyDown}
      />

      {hasQuery && (
        <SearchCategoryFilter selected={categoryFilter} onChange={setCategoryFilter} />
      )}

      {!hasQuery && <SearchEmptyState />}
      {hasQuery && !hasResults && <SearchNoResults query={query} />}
      {hasResults && (
        <SearchResults
          results={filtered}
          query={query}
          selectedIndex={selectedIndex}
        />
      )}
    </div>
  );
}
