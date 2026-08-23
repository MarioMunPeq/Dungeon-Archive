import { useMemo } from "react";
import { Outlet, useMatch, useSearchParams } from "react-router-dom";
import type { EntityCategory } from "@/compendium";
import {
  categoryLabel,
  categoryLabelSingular,
  getEntitiesForCategory,
  buildFilterDefs,
  applyFilters,
  getSortOptions,
  sortEntities,
  toCardData,
  dedupeEntities,
} from "@/compendium";
import type { CategorySort } from "@/compendium";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCompendiumLoaded } from "@/hooks/use-compendium-loaded";
import { FilterBar } from "../components/filter-bar";
import { EntityList } from "../components/entity-list";
import { CategorySkeleton } from "../components/category-skeleton";
import { SearchInput } from "@/components/search";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/SelectField";

interface CategoryPageProps {
  readonly category: EntityCategory;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailMatch = useMatch(`/${category}/:canonicalId`);
  const isLoaded = useCompendiumLoaded();

  const allEntities = useMemo(() => getEntitiesForCategory(category), [category]);
  const filterDefs = useMemo(() => buildFilterDefs(category, allEntities), [category, allEntities]);
  const sortOptions = useMemo(() => getSortOptions(category), [category]);

  const currentFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    for (const def of filterDefs) {
      const val = searchParams.get(def.key);
      if (val) filters[def.key] = val;
    }
    return filters;
  }, [searchParams, filterDefs]);

  const query = searchParams.get("q") ?? "";
  const debouncedQuery = useDebouncedValue(query, 200);
  const sort = searchParams.get("sort") ?? "";

  const filtered = useMemo(
    () => applyFilters(category, allEntities, currentFilters),
    [category, allEntities, currentFilters],
  );

  const searched = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter((entity) => entity.name.toLowerCase().includes(q));
  }, [filtered, debouncedQuery]);

  const sorted = useMemo(
    () => sortEntities(category, searched, (sort || null) as CategorySort | null),
    [category, searched, sort],
  );

  const cards = useMemo(
    () =>
      dedupeEntities(sorted).map(({ entity, versionCount }) => ({
        ...toCardData(category, entity),
        versionCount,
      })),
    [category, sorted],
  );

  const updateParam = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
  };

  const handleClearFilters = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const def of filterDefs) {
          next.delete(def.key);
        }
        return next;
      },
      { replace: true },
    );
  };

  const hasActiveQuery = debouncedQuery.trim().length > 0;
  const hasActiveFilters = Object.keys(currentFilters).length > 0;
  const isFiltered = hasActiveQuery || hasActiveFilters;

  const label = categoryLabel(category);
  const labelLower = categoryLabelSingular(category).toLowerCase();
  const emptyMessage =
    hasActiveQuery && hasActiveFilters
      ? `No ${labelLower} match your search and filters`
      : hasActiveFilters
        ? `No ${labelLower} match these filters`
        : `No ${labelLower} match your search`;

  if (!isLoaded) {
    return <CategorySkeleton />;
  }

  return (
    <div>
      <div className={detailMatch ? "hidden" : undefined}>
        <div className="sticky top-0 z-30 space-y-3 border-b border-border bg-background/95 px-4 pb-3 pt-4 backdrop-blur-sm">
          <SearchInput
            value={query}
            onChange={(value) => updateParam("q", value)}
            ariaLabel={`Search ${label}`}
            placeholder={`Search ${labelLower}\u2026`}
          />
          <FilterBar
            filters={filterDefs}
            values={currentFilters}
            onChange={updateParam}
            onClearAll={hasActiveFilters ? handleClearFilters : undefined}
          />
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{cards.length}</span>
            {isFiltered ? ` of ${allEntities.length} ${labelLower}` : ` ${labelLower}`}
          </p>
          <SelectField
            value={sort}
            options={sortOptions}
            onChange={(value) => updateParam("sort", value)}
            ariaLabel="Sort"
            placeholder="Sort"
          />
        </div>

        <div className="px-4 pb-4">
          <EntityList
            entities={cards}
            emptyMessage={emptyMessage}
            emptyAction={
              isFiltered ? (
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        </div>
      </div>
      <Outlet />
    </div>
  );
}
