import type { ReactNode } from "react";
import { categoryLabelSingular } from "@/compendium";
import type { EntityCategory } from "@/compendium";
import { Badge } from "@/components/ui/Badge";
import { badgeVariantForCategory } from "./entity-reference";

interface EntityIdentityProps {
  readonly category: EntityCategory;
  readonly name: ReactNode;
  readonly subtitle?: ReactNode;
  readonly showBadge?: boolean;
}

export function EntityIdentity({
  category,
  name,
  subtitle,
  showBadge = true,
}: EntityIdentityProps) {
  return (
    <>
      {showBadge && (
        <Badge variant={badgeVariantForCategory(category)} className="shrink-0">
          {categoryLabelSingular(category)}
        </Badge>
      )}
      {/* line-clamp rather than truncate: Design DNA rule 40 forbids cutting a label
          with an ellipsis. Entity names like "Barbaric" or "Mordenkainen's Faithful
          Sword" have to stay readable, so they wrap to a second line instead. */}
      <div className="min-w-0 flex-1 space-y-1">
        <p className="line-clamp-2 text-base font-medium text-foreground">{name}</p>
        {subtitle != null && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </>
  );
}
