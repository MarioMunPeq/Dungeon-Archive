import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { EntityCategory } from "@/compendium";
import {
  categoryLabel,
  categoryLabelSingular,
  getEntitiesForCategory,
  buildFilterDefs,
  applyFilters,
  toCardData,
} from "@/compendium";
import { FilterBar } from "../components/filter-bar";
import { EntityList } from "../components/entity-list";
import { Button } from "@/components/ui/Button";
import { EntityBreadcrumbs } from "@/components/ui/breadcrumbs";

interface CategoryPageProps {
  readonly category: EntityCategory;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const allEntities = useMemo(() => getEntitiesForCategory(category), [category]);
  const filterDefs = useMemo(() => buildFilterDefs(category, allEntities), [category, allEntities]);
  const currentFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    for (const def of filterDefs) {
      const val = searchParams.get(def.key);
      if (val) filters[def.key] = val;
    }
    return filters;
  }, [searchParams, filterDefs]);

  const filtered = useMemo(
    () => applyFilters(category, allEntities, currentFilters),
    [category, allEntities, currentFilters],
  );

  const cards = useMemo(() => filtered.map((e) => toCardData(category, e)), [category, filtered]);

  const handleFilterChange = (key: string, value: string) => {
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

  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return (
    <div className="space-y-6 px-4 py-6">
      <EntityBreadcrumbs
        crumbs={[{ label: "Home", to: "/" }, { label: categoryLabel(category) }]}
      />
      <div>
        <h1 className="text-xl font-bold text-foreground">{categoryLabel(category)}</h1>
        <p className="text-xs text-muted-foreground">
          {allEntities.length} {categoryLabelSingular(category).toLowerCase()}
          {filtered.length < allEntities.length ? ` (${filtered.length} filtered)` : ""}
        </p>
      </div>

      <FilterBar filters={filterDefs} values={currentFilters} onChange={handleFilterChange} />

      <EntityList
        entities={cards}
        emptyMessage={`No ${categoryLabelSingular(category).toLowerCase()} match your filters`}
        emptyAction={
          hasActiveFilters ? (
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Clear filters
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
