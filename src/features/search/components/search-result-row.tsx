import { Link } from "react-router";
import type { SearchIndexEntry } from "@/compendium";

interface SearchResultRowProps {
  readonly result: SearchIndexEntry;
}

export function SearchResultRow({ result }: SearchResultRowProps) {
  return (
    <Link
      to={`/${result.category}/${result.id}`}
      className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-accent active:bg-accent/80"
    >
      <div className="min-w-0 space-y-0.5">
        <p className="truncate text-sm font-medium text-foreground">{result.name}</p>
        <p className="text-xs capitalize text-muted-foreground">{result.category}</p>
      </div>
      <span className="ml-2 shrink-0 text-muted-foreground">›</span>
    </Link>
  );
}
