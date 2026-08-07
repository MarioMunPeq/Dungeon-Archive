import { memo } from "react";
import { Link } from "react-router-dom";
import type { SearchResultItem } from "@/components/entity";
import { EntityIdentity, EntityCardStat } from "@/components/entity";
import { SearchHighlight } from "./search-highlight";

interface SearchResultRowProps extends SearchResultItem {
  readonly query: string;
  readonly isSelected: boolean;
  readonly id: string;
}

const ROW_BASE = "flex items-center gap-3 px-4 py-3 transition-colors";
const ROW_SELECTED = "bg-accent";

export const SearchResultRow = memo(function SearchResultRow({
  title,
  subtitle,
  category,
  to,
  query,
  isSelected,
  id,
  stat,
}: SearchResultRowProps) {
  return (
    <Link
      id={id}
      to={to}
      role="option"
      aria-selected={isSelected}
      className={`${ROW_BASE} ${isSelected ? ROW_SELECTED : "hover:bg-accent/50 active:bg-accent/80"}`}
    >
      <EntityIdentity
        category={category}
        name={<SearchHighlight text={title} query={query} />}
        subtitle={subtitle}
      />

      {stat && <EntityCardStat stat={stat} />}
      <span aria-hidden className="shrink-0 text-xl leading-none text-muted-foreground">
        ›
      </span>
    </Link>
  );
});
