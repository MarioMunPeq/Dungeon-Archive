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
import { t } from "@/i18n";
import { useLanguage } from "@/user-state";
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
  const language = useLanguage();

  const allEntities = useMemo(() => getEntitiesForCategory(category), [category]);
  // Filter and sort labels are localized inside the compendium helpers via the
  // store-aware t(), so the lint rule cannot see them as a dependency. Without
  // `language` these memos would survive a language switch with stale labels.
  /* eslint-disable react-hooks/exhaustive-deps -- `language` drives localized labels built via the store-aware t() */
  const filterDefs = useMemo(
    () => buildFilterDefs(category, allEntities),
    [category, allEntities, language],
  );
  const sortOptions = useMemo(() => getSortOptions(category), [category, language]);
  /* eslint-enable react-hooks/exhaustive-deps */

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
      ? t("category.emptyQueryAndFilters", { label: labelLower })
      : hasActiveFilters
        ? t("category.emptyFilters", { label: labelLower })
        : t("category.emptyQuery", { label: labelLower });

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
            ariaLabel={t("category.searchLabel", { subject: label })}
            placeholder={t("category.searchPlaceholder", { label: labelLower })}
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
            {isFiltered
              ? t("category.countOf", { count: allEntities.length, label: labelLower })
              : ` ${labelLower}`}
          </p>
          <SelectField
            value={sort}
            options={sortOptions}
            onChange={(value) => updateParam("sort", value)}
            ariaLabel={t("sort.label")}
            placeholder={t("sort.label")}
          />
        </div>

        <div className="px-4 pb-4">
          <EntityList
            entities={cards}
            emptyMessage={emptyMessage}
            emptyAction={
              isFiltered ? (
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  {t("filter.clear")}
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
