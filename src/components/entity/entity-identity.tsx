import type { ReactNode } from "react";
import { CATEGORY_REGISTRY } from "@/compendium";
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
          {CATEGORY_REGISTRY[category].singular}
        </Badge>
      )}
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-base font-medium text-foreground">{name}</p>
        {subtitle != null && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </>
  );
}
