import { useState, useRef, useEffect, useMemo, type KeyboardEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { search } from "@/compendium";
import { createSearchResultItems } from "@/components/entity";
import { SearchInput, FilterChips, EmptyResults } from "@/components/search";
import { SearchResults } from "./components/search-results";
import { SearchEmptyState } from "./components/search-empty-state";
import { userStore } from "@/user-state";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { CATEGORY_REGISTRY } from "@/compendium";
import { Button } from "@/components/ui/Button";

const CATEGORY_OPTIONS = [
  { value: "", label: "All" },
  ...Object.entries(CATEGORY_REGISTRY).map(([key, reg]) => ({
    value: key,
    label: reg.plural,
  })),
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = useRef(searchParams.get("q") ?? "").current;
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebouncedValue(query, 200);
  const rawResults = search(debouncedQuery);
  const results = useMemo(
    () => createSearchResultItems(debouncedQuery, rawResults),
    [debouncedQuery, rawResults],
  );

  const filtered = useMemo(() => {
    if (!categoryFilter) return results;
    return results.filter((r) => r.category === categoryFilter);
  }, [results, categoryFilter]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (query !== current) {
      setSearchParams(query ? { q: query } : {}, { replace: true });
    }
  }, [query, searchParams, setSearchParams]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [debouncedQuery, categoryFilter]);

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
          userStore.getState().addRecentSearch(query);
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

  const hasQuery = debouncedQuery.trim().length > 0;
  const hasResults = filtered.length > 0;
  const activeDescendantId = selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined;

  return (
    <div className="flex flex-col pb-4">
      <div className="px-4 pt-4">
        <SearchInput
          ref={inputRef}
          value={query}
          onChange={setQuery}
          onKeyDown={handleKeyDown}
          placeholder="Search spells, equipment, conditions..."
          ariaLabel="Search"
          role="combobox"
          ariaExpanded={hasResults}
          ariaControls="search-results-listbox"
          activeDescendantId={activeDescendantId}
        />
      </div>

      {hasQuery && (
        <div className="px-4 pt-3 pb-1">
          <FilterChips
            options={CATEGORY_OPTIONS}
            selected={categoryFilter}
            onChange={setCategoryFilter}
            ariaLabel="Filter by category"
          />
        </div>
      )}

      {!hasQuery && <SearchEmptyState />}
      {hasQuery && !hasResults && (
        <div className="px-4">
          <EmptyResults
            title={`No results for \u201c${debouncedQuery}\u201d`}
            description={
              <>
                Try a different search term, or{" "}
                <Link
                  to="/"
                  className="text-primary transition-colors duration-150 hover:underline"
                >
                  look through the Compendium
                </Link>
              </>
            }
            action={
              <Button variant="outline" size="sm" onClick={() => setQuery("")}>
                Clear search
              </Button>
            }
          />
        </div>
      )}
      {hasResults && (
        <SearchResults results={filtered} query={debouncedQuery} selectedIndex={selectedIndex} />
      )}
    </div>
  );
}
