interface SearchNoResultsProps {
  readonly query: string;
}

export function SearchNoResults({ query }: SearchNoResultsProps) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      <p className="mb-2 text-sm text-muted-foreground">
        No results for &ldquo;{query}&rdquo;
      </p>
      <p className="text-xs text-foreground-subtle">
        Try a different search term or browse categories
      </p>
    </div>
  );
}
