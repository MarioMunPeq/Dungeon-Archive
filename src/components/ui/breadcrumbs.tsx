import { Link } from "react-router-dom";

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
      <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.to ?? crumb.label} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className="text-muted-foreground/60">
                  /
                </span>
              )}
              {crumb.to && !isLast ? (
                <Link
                  to={crumb.to}
                  className="transition-colors hover:text-foreground active:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "text-foreground font-medium" : ""}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
