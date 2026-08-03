import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

interface SearchNoResultsProps {
  readonly query: string;
  readonly onClear?: () => void;
}

export function SearchNoResults({ query, onClear }: SearchNoResultsProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-10 text-center">
      <p className="text-sm font-medium text-foreground">No results for &ldquo;{query}&rdquo;</p>
      <p className="w-full max-w-md text-xs text-foreground-subtle">
        Try a different search term, or{" "}
        <Link to="/" className="text-primary transition-colors duration-150 hover:underline">
          look through the Compendium
        </Link>
      </p>
      {onClear && (
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear search
        </Button>
      )}
    </div>
  );
}
