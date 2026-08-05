import { useMemo } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
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
} from "@/compendium";
import type { CategorySort } from "@/compendium";
import { FilterBar } from "../components/filter-bar";
import { EntityList } from "../components/entity-list";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/SelectField";
import { SearchField } from "@/components/ui/SearchField";

interface CategoryPageProps {
  readonly category: EntityCategory;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();

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
  const sort = searchParams.get("sort") ?? "";

  const filtered = useMemo(
    () => applyFilters(category, allEntities, currentFilters),
    [category, allEntities, currentFilters],
  );

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter((entity) => entity.name.toLowerCase().includes(q));
  }, [filtered, query]);

  const sorted = useMemo(
    () => sortEntities(category, searched, (sort || null) as CategorySort | null),
    [category, searched, sort],
  );

  const cards = useMemo(() => sorted.map((e) => toCardData(category, e)), [category, sorted]);

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

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const hasActiveQuery = query.trim().length > 0;
  const hasActiveFilters = Object.keys(currentFilters).length > 0;
  const isFiltered = hasActiveQuery || hasActiveFilters;

  const label = categoryLabel(category);
  const labelLower = categoryLabelSingular(category).toLowerCase();

  return (
    <div>
      <div className="sticky top-0 z-30 space-y-3 border-b border-border bg-background/95 px-4 pb-3 pt-4 backdrop-blur-sm">
        <SearchField
          value={query}
          onChange={(value) => updateParam("q", value)}
          ariaLabel={`Search ${label}`}
          placeholder={`Search ${labelLower}\u2026`}
        />
        <FilterBar filters={filterDefs} values={currentFilters} onChange={updateParam} />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{sorted.length}</span>
          {isFiltered
            ? ` of ${allEntities.length} ${labelLower}`
            : ` ${labelLower}`}
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
          emptyMessage={`No ${labelLower} match your search`}
          emptyAction={
            isFiltered ? (
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
        <Outlet />
      </div>
    </div>
  );
}
