import { memo } from "react";
import { Link } from "react-router";
import { formatSource } from "@/compendium";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

export interface EntityCardData {
  readonly name: string;
  readonly href: string;
  readonly categoryLabel: string;
  readonly metadata: string;
  readonly source: string;
  readonly canonicalId: string;
}

export const EntityCard = memo(function EntityCard({ name, href, categoryLabel, metadata, source, canonicalId }: EntityCardData) {
  return (
    <Link
      to={href}
      className="flex flex-col gap-1 rounded-lg border border-border p-3 transition-colors hover:bg-accent active:bg-accent/80"
    >
      <div className="flex items-center justify-between">
        <span className="truncate text-sm font-medium text-foreground">{name}</span>
        <FavoriteButton canonicalId={canonicalId} />
      </div>
      <span className="text-xs text-muted-foreground">
        {categoryLabel}
        {metadata ? ` \u00B7 ${metadata}` : ""}
      </span>
      <span className="text-xs text-muted-foreground/60">{formatSource(source)}</span>
    </Link>
  );
});
