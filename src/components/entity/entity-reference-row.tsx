import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatSource } from "@/compendium";
import { ChevronRightIcon, CloseIcon } from "@/components/ui/icons";
import { entityRefFromCanonicalId } from "./entity-reference";
import { EntityIdentity } from "./entity-identity";

interface EntityReferenceRowProps {
  readonly canonicalId: string;
  readonly subtitle?: string;
  readonly showBadge?: boolean;
  readonly trailing?: ReactNode;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function EntityReferenceRow({
  canonicalId,
  subtitle,
  showBadge = true,
  trailing,
  action,
  className = "",
}: EntityReferenceRowProps) {
  const ref = entityRefFromCanonicalId(canonicalId);
  if (!ref) return null;

  const base = cn("flex items-center gap-3", className);
  const identity = (
    <EntityIdentity
      category={ref.category}
      name={ref.name}
      subtitle={subtitle ?? formatSource(ref.source)}
      showBadge={showBadge}
    />
  );

  // The expandable branch was removed: nothing renders with `onToggle`, and it
  // put the `action` button (a real <button>) inside a div carrying
  // role="button" — nested interactive controls, which screen readers announce
  // as one control inside another and keyboards handle inconsistently. The
  // character sheet's expandable rows are plain <button> siblings instead
  // (see character-page.tsx ReferenceCell).
  return (
    <Link
      to={ref.href}
      className={cn(base, "transition-all duration-150 hover:bg-accent/50 active:bg-accent/80")}
    >
      {identity}
      {trailing}
      {action}
      <ChevronRightIcon className="text-foreground-subtle" />
    </Link>
  );
}

interface RowRemoveButtonProps {
  readonly label: string;
  readonly onClick: () => void;
}

export function RowRemoveButton({ label, onClick }: RowRemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className="hitbox-expand relative inline-flex h-8 w-8 items-center justify-center rounded-control text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
    >
      <CloseIcon />
    </button>
  );
}
