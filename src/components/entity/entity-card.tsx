import { memo } from "react";
import { Link } from "react-router-dom";
import { formatSource } from "@/compendium";
import type { EntityCardData } from "@/compendium";
import { Badge } from "@/components/ui/Badge";
import { badgeVariantForCategory } from "./entity-reference";
import { EntityCardStat } from "./entity-card-stat";

export const EntityCard = memo(function EntityCard({
  name,
  href,
  category,
  categoryLabel,
  metadata,
  source,
  versionCount,
  stat,
}: EntityCardData) {
  return (
    <Link
      to={href}
      className="flex h-full flex-col gap-1.5 rounded-card border border-border bg-surface p-3 transition-colors hover:bg-accent active:bg-accent/80"
    >
      <span className="flex min-w-0 items-start gap-2">
        <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-foreground">
          {name}
        </span>
        <span aria-hidden className="shrink-0 text-lg leading-none text-muted-foreground">
          ›
        </span>
      </span>
      <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <Badge variant={badgeVariantForCategory(category)}>{categoryLabel}</Badge>
        {stat && <EntityCardStat stat={stat} />}
        {versionCount != null && versionCount > 1 && (
          <span className="shrink-0 text-xs text-foreground-subtle">{versionCount} versions</span>
        )}
      </span>
      <span className="flex flex-wrap items-center gap-x-1.5 text-xs leading-snug text-foreground-subtle">
        {metadata && <span>{metadata}</span>}
        {!metadata?.includes(formatSource(source)) && <span>{formatSource(source)}</span>}
      </span>
    </Link>
  );
});
