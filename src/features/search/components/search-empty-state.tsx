import { Link } from "react-router";
import { CATEGORY_REGISTRY } from "@/compendium";

const recentSearches: string[] = [];

export function addRecentSearch(query: string): void {
  const idx = recentSearches.indexOf(query);
  if (idx !== -1) recentSearches.splice(idx, 1);
  recentSearches.unshift(query);
  if (recentSearches.length > 5) recentSearches.pop();
}

export function SearchEmptyState() {
  return (
    <div className="flex flex-col gap-6 px-4 pt-6">
      {recentSearches.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Recent Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((q) => (
              <Link
                key={q}
                to={`/search?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Browse Categories
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.entries(CATEGORY_REGISTRY).map(([key, reg]) => (
            <Link
              key={key}
              to={`/${key}`}
              className="rounded-lg border border-border p-3 text-center transition-colors hover:bg-accent hover:text-foreground"
            >
              <span className="text-sm font-medium text-foreground">{reg.plural}</span>
            </Link>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Search spells, monsters, equipment, and more
      </p>
    </div>
  );
}
