import { Link } from "react-router";
import type { SearchResultItem } from "@/components/entity";
import { CATEGORY_REGISTRY, formatSource } from "@/compendium";
import { Badge } from "@/components/ui/Badge";
import { SearchHighlight } from "./search-highlight";

interface SearchResultRowProps extends SearchResultItem {
  readonly query: string;
  readonly isSelected: boolean;
}

const BADGE_VARIANT: Record<string, "default" | "accent" | "outline" | "subtle"> = {
  spell: "default",
  monster: "accent",
  equipment: "outline",
  magicitem: "accent",
  feat: "subtle",
  condition: "outline",
  action: "subtle",
};

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
}: SearchResultRowProps) {
  const cat = CATEGORY_REGISTRY[category];
  const variant = BADGE_VARIANT[category] ?? "default";
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
    </Link>
  );
}
