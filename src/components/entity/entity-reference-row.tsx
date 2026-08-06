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
  readonly expanded?: boolean;
  readonly onToggle?: () => void;
  readonly trailing?: ReactNode;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function EntityReferenceRow({
  canonicalId,
  subtitle,
  showBadge = true,
  expanded,
  onToggle,
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

  if (typeof onToggle === "function") {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={cn(
          base,
          "cursor-pointer transition-all duration-150 hover:bg-accent/50 active:bg-accent/80",
          expanded && "bg-accent/40",
        )}
      >
        {identity}
        {trailing}
        {action}
        <ChevronRightIcon
          className={cn(
            "text-foreground-subtle transition-transform duration-150 ease-out",
            expanded === true && "rotate-90",
          )}
        />
      </div>
    );
  }

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
      className="hitbox-expand inline-flex h-8 w-8 items-center justify-center rounded-control text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
    >
      <CloseIcon />
    </button>
  );
}
