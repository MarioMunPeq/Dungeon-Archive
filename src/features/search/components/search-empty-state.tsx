import { Link } from "react-router-dom";
import { CATEGORY_REGISTRY } from "@/compendium";
import { useRecentSearches } from "@/user-state";

export function SearchEmptyState() {
  const recentSearches = useRecentSearches(5);

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
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Categories
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(CATEGORY_REGISTRY).map(([key, reg]) => (
            <Link
              key={key}
              to={`/${key}`}
              className="flex items-center justify-between gap-2 rounded-card border border-border bg-surface px-3 py-3 transition-colors hover:bg-accent active:bg-accent/80"
            >
              <span className="text-sm font-medium text-foreground">{reg.plural}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4 shrink-0 text-muted-foreground"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
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
