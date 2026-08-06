import { memo } from "react";
import { Link } from "react-router-dom";
import { formatSource } from "@/compendium";
import type { EntityCardData } from "@/compendium";
import { Badge } from "@/components/ui/Badge";
import { badgeVariantForCategory } from "./entity-reference";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { SessionButton } from "@/components/ui/SessionButton";

export const EntityCard = memo(function EntityCard({
  name,
  href,
  category,
  categoryLabel,
  metadata,
  source,
  canonicalId,
  versionCount,
}: EntityCardData) {
  return (
    <Link
      to={href}
      className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-accent active:bg-accent/80"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-base font-medium text-foreground">{name}</span>
        <span className="flex shrink-0 items-center gap-1">
          <FavoriteButton canonicalId={canonicalId} />
          <SessionButton canonicalId={canonicalId} />
        </span>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <Badge variant={badgeVariantForCategory(category)}>{categoryLabel}</Badge>
        {metadata ? (
          <span className="truncate text-xs text-muted-foreground">{metadata}</span>
        ) : null}
        {versionCount != null && versionCount > 1 && (
          <span className="shrink-0 text-xs text-foreground-subtle">{versionCount} versions</span>
        )}
      </div>
      <span className="text-xs text-foreground-subtle">{formatSource(source)}</span>
    </Link>
  );
});
