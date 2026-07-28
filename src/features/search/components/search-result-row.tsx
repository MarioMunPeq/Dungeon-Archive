import { Link } from "react-router";

interface SearchResultRowProps {
  readonly title: string;
  readonly subtitle: string;
  readonly to: string;
}

export function SearchResultRow({ title, subtitle, to }: SearchResultRowProps) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-accent active:bg-accent/80"
    >
      <div className="min-w-0 space-y-0.5">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <span className="ml-2 shrink-0 text-muted-foreground">›</span>
    </Link>
  );
}
