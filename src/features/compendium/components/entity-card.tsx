import { Link } from "react-router";
import { formatSource } from "@/compendium";

export interface EntityCardData {
  readonly name: string;
  readonly href: string;
  readonly categoryLabel: string;
  readonly metadata: string;
  readonly source: string;
}

export function EntityCard({ name, href, categoryLabel, metadata, source }: EntityCardData) {
  return (
    <Link
      to={href}
      className="flex flex-col gap-1 rounded-lg border border-border p-3 transition-colors hover:bg-accent active:bg-accent/80"
    >
      <span className="truncate text-sm font-medium text-foreground">{name}</span>
      <span className="text-xs text-muted-foreground">
        {categoryLabel}
        {metadata ? ` \u00B7 ${metadata}` : ""}
      </span>
      <span className="text-xs text-muted-foreground/60">{formatSource(source)}</span>
    </Link>
  );
}
