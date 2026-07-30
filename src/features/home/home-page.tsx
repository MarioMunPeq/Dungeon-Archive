import { Link } from "react-router";
import { categoryLabel, getCategoryCount, CATEGORY_REGISTRY } from "@/compendium";
import type { EntityCategory } from "@/compendium";

const CATEGORIES = Object.keys(CATEGORY_REGISTRY) as EntityCategory[];

export function HomePage() {
  return (
    <div className="flex flex-col gap-8 px-4 py-8">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Dungeon Archive</h1>
        <p className="text-sm text-muted-foreground">Your tabletop companion</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            to={`/${cat}`}
            className="flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:bg-accent active:bg-accent/80"
          >
            <span className="text-base font-semibold text-foreground">{categoryLabel(cat)}</span>
            <span className="text-sm text-muted-foreground">{getCategoryCount(cat)} entries</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          to="/search"
          className="rounded-lg border border-border p-4 text-center transition-colors hover:bg-accent active:bg-accent/80"
        >
          <span className="text-sm font-medium text-foreground">Search</span>
        </Link>
        <Link
          to="/adventure"
          className="rounded-lg border border-border p-4 text-center transition-colors hover:bg-accent active:bg-accent/80"
        >
          <span className="text-sm font-medium text-foreground">Adventure</span>
        </Link>
      </div>
    </div>
  );
}
