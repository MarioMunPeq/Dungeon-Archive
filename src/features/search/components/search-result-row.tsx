import { Link } from "react-router-dom";
import type { SearchResultItem } from "@/components/entity";
import { EntityIdentity } from "@/components/entity";
import { SearchHighlight } from "./search-highlight";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { SessionButton } from "@/components/ui/SessionButton";

interface SearchResultRowProps extends SearchResultItem {
  readonly query: string;
  readonly isSelected: boolean;
  readonly id: string;
}

const ROW_BASE = "flex items-center gap-3 px-4 py-3 transition-colors";
const ROW_SELECTED = "bg-accent";

export function SearchResultRow({
  title,
  subtitle,
  category,
  to,
  query,
  isSelected,
  canonicalId,
  id,
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

      <FavoriteButton canonicalId={canonicalId} />
      <SessionButton canonicalId={canonicalId} />
    </Link>
  );
}
