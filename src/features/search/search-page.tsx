import { useState, useRef, useEffect, useMemo, type KeyboardEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { search } from "@/compendium";
import { createSearchResultItems } from "@/components/entity";
import { SearchInput, FilterChips, EmptyResults } from "@/components/search";
import { SearchResults } from "./components/search-results";
import { SearchEmptyState } from "./components/search-empty-state";
import { userStore, useLanguage } from "@/user-state";
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
  // The category labels are localized, so this has to be rebuilt on a language
  // switch — but not on every keystroke.
  const language = useLanguage();
  const categoryFilters = useMemo(() => categoryOptions(), [language]);
  // The query lives in the URL. Freezing it into state on mount made a
  // recent-search chip (<Link to="/archive?q=...">) navigate in place without
  // remounting this component, and the effect below then wiped the `q` param,
  // so the chip looked dead. `urlQuery` is the source of truth; `draft` is only
  // the in-progress text, so typing stays responsive while the URL is debounced.
  const urlQuery = searchParams.get("q") ?? "";
  const [draft, setDraft] = useState(urlQuery);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebouncedValue(draft, 200);
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

  // Adopt the URL when it changes from outside (recent-search chip, back/forward).
  useEffect(() => {
    setDraft((prev) => (prev === urlQuery ? prev : urlQuery));
  }, [urlQuery]);

  // Push local edits into the URL, preserving the `tab` param ArchivePage owns.
  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (draft === current) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (draft) next.set("q", draft);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  }, [draft, searchParams, setSearchParams]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [debouncedQuery, categoryFilter]);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "Escape":
        if (draft) {
          setDraft("");
          e.preventDefault();
        }
        break;
      case "Enter": {
        e.preventDefault();
        const target = selectedIndex >= 0 ? filtered[selectedIndex] : filtered[0];
        if (target) {
          userStore.getState().addRecentSearch(draft);
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
          value={draft}
          onChange={setDraft}
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
            options={categoryFilters}
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
              <Button variant="outline" size="sm" onClick={() => setDraft("")}>
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
