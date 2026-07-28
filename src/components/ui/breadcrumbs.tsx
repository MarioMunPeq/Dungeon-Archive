import { Link } from "react-router";

interface Crumb {
  readonly label: string;
  readonly to?: string;
}

interface EntityBreadcrumbsProps {
  readonly crumbs: readonly Crumb[];
}

export function EntityBreadcrumbs({ crumbs }: EntityBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {crumb.to && !isLast ? (
                <Link to={crumb.to} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? "text-foreground font-medium" : ""}>{crumb.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
