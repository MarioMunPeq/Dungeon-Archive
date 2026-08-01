import { Link } from "react-router-dom";
import type { SearchResultItem } from "@/components/entity";
import { CATEGORY_REGISTRY, formatSource } from "@/compendium";
import { badgeVariantForCategory } from "@/components/entity";
import { Badge } from "@/components/ui/Badge";
import { SearchHighlight } from "./search-highlight";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { SessionButton } from "@/components/ui/SessionButton";
import { AdventureButton } from "@/components/ui/AdventureButton";

interface SearchResultRowProps extends SearchResultItem {
  readonly query: string;
  readonly isSelected: boolean;
}

const ROW_BASE =
  "flex items-center gap-3 px-4 py-3 transition-colors";
const ROW_SELECTED = "bg-accent";

export function SearchResultRow({
  title,
  subtitle,
  category,
  source,
  to,
  query,
  isSelected,
  canonicalId,
}: SearchResultRowProps) {
  const cat = CATEGORY_REGISTRY[category];
  const variant = badgeVariantForCategory(category);
  const displaySource = formatSource(source);

  return (
    <Link
      to={to}
      className={`${ROW_BASE} ${isSelected ? ROW_SELECTED : "hover:bg-accent/50 active:bg-accent/80"}`}
    >
      <Badge variant={variant} className="shrink-0">
        {cat.singular}
      </Badge>

      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate text-sm font-medium text-foreground">
          <SearchHighlight text={title} query={query} />
        </p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>

      <span className="shrink-0 text-xs text-muted-foreground">{displaySource}</span>
      <FavoriteButton canonicalId={canonicalId} />
      <SessionButton canonicalId={canonicalId} />
      <AdventureButton canonicalId={canonicalId} />
    </Link>
  );
}
