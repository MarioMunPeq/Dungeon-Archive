import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CATEGORY_REGISTRY, formatSource } from "@/compendium";
import { Badge } from "@/components/ui/Badge";
import { badgeVariantForCategory, entityRefFromCanonicalId } from "./entity-reference";

interface EntityReferenceRowProps {
  readonly canonicalId: string;
  readonly subtitle?: string;
  readonly showBadge?: boolean;
  readonly asLink?: boolean;
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
  asLink = true,
  expanded,
  onToggle,
  trailing,
  action,
  className = "",
}: EntityReferenceRowProps) {
  const ref = entityRefFromCanonicalId(canonicalId);
  if (!ref) return null;

  const base = cn("flex items-center gap-3", className);

  const badge = showBadge && (
    <Badge variant={badgeVariantForCategory(ref.category)} className="shrink-0">
      {CATEGORY_REGISTRY[ref.category].singular}
    </Badge>
  );

  const text = (
    <>
      <p className="truncate text-sm font-medium text-foreground">{ref.name}</p>
      <p className="truncate text-xs text-muted-foreground">
        {subtitle ?? formatSource(ref.source)}
      </p>
    </>
  );

  const chevron = (rotate: boolean) => (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={cn(
        "h-4 w-4 shrink-0 text-foreground-subtle transition-transform duration-150 ease-out",
        rotate && "rotate-90",
      )}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
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
        {badge}
        <div className="min-w-0 flex-1">{text}</div>
        {trailing}
        {action}
        {chevron(expanded === true)}
      </div>
    );
  }

  if (asLink) {
    return (
      <Link
        to={ref.href}
        className={cn(base, "transition-all duration-150 hover:bg-accent/50 active:bg-accent/80")}
      >
        {badge}
        <div className="min-w-0 flex-1">{text}</div>
        {trailing}
        {action}
        {chevron(false)}
      </Link>
    );
  }

  return (
    <div className={base}>
      {badge}
      <Link to={ref.href} className="min-w-0 flex-1">
        {text}
      </Link>
      {trailing}
      {action}
    </div>
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
      className="hitbox-expand inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="h-4 w-4"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}
