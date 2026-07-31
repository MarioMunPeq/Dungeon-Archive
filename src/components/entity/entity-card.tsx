import { memo } from "react";
import { Link } from "react-router-dom";
import { formatSource } from "@/compendium";
import type { EntityCardData } from "@/compendium";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { SessionButton } from "@/components/ui/SessionButton";
import { AdventureButton } from "@/components/ui/AdventureButton";

export const EntityCard = memo(function EntityCard({ name, href, categoryLabel, metadata, source, canonicalId }: EntityCardData) {
  return (
    <Link
      to={href}
      className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-3 transition-colors hover:bg-accent active:bg-accent/80"
    >
      <div className="flex items-center justify-between">
        <span className="truncate text-sm font-medium text-foreground">{name}</span>
        <span className="flex items-center gap-1">
          <FavoriteButton canonicalId={canonicalId} />
          <SessionButton canonicalId={canonicalId} />
          <AdventureButton canonicalId={canonicalId} />
        </span>
      </div>
      <span className="text-xs text-muted-foreground">
        {categoryLabel}
        {metadata ? ` \u00B7 ${metadata}` : ""}
      </span>
      <span className="text-xs text-foreground-subtle">{formatSource(source)}</span>
    </Link>
  );
});
