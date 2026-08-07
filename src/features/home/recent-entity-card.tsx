import { Link } from "react-router-dom";
import { Badge } from "@/components/ui";

interface RecentEntityCardProps {
  readonly name: string;
  readonly href: string;
  readonly categoryLabel: string;
  readonly metadata?: string;
}

export function RecentEntityCard({
  name,
  href,
  categoryLabel,
  metadata,
}: RecentEntityCardProps) {
  return (
    <Link
      to={href}
      className="flex h-full flex-col gap-1 rounded-card border border-border bg-surface p-3 transition-colors duration-primary ease-standard hover:bg-accent active:bg-accent/80"
    >
      <Badge variant="outline" className="w-fit">
        {categoryLabel}
      </Badge>
      <span className="truncate text-sm font-semibold text-foreground">{name}</span>
      {metadata && <span className="truncate text-xs text-muted-foreground">{metadata}</span>}
    </Link>
  );
}
