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
import { t } from "@/i18n";
import { Button } from "@/components/ui/Button";

/** Built per call: the category labels are localized. */
function categoryOptions(): { value: string; label: string }[] {
  return [
    { value: "", label: t("filter.all") },
    ...Object.entries(CATEGORY_REGISTRY).map(([key, reg]) => ({
      value: key,
      label: t(reg.plural),
    })),
  ];
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = useRef(searchParams.get("q") ?? "").current;
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebouncedValue(query, 200);
  const rawResults = useMemo(() => search(debouncedQuery), [debouncedQuery]);
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
          placeholder={t("search.placeholder")}
          ariaLabel={t("common.search")}
          role="combobox"
          ariaExpanded={hasResults}
          ariaControls="search-results-listbox"
          activeDescendantId={activeDescendantId}
        />
      </div>

      {hasQuery && (
        <div className="px-4 pt-3 pb-1">
          <FilterChips
            options={categoryOptions()}
            selected={categoryFilter}
            onChange={setCategoryFilter}
            ariaLabel={t("search.filterByCategory")}
          />
        </div>
      )}

      {!hasQuery && <SearchEmptyState />}
      {hasQuery && !hasResults && (
        <div className="px-4">
          <EmptyResults
            title={t("search.noResults", { query: debouncedQuery })}
            description={
              <>
                {t("search.noResultsBody")}{" "}
                <Link
                  to="/"
                  className="text-primary transition-colors duration-150 hover:underline"
                >
                  {t("search.browseCompendium")}
                </Link>
              </>
            }
            action={
              <Button variant="outline" size="sm" onClick={() => setQuery("")}>
                {t("search.clear")}
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
