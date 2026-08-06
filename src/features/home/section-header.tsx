import { Link } from "react-router-dom";

interface SectionHeaderProps {
  readonly title: string;
  readonly to?: string;
  readonly chevron?: boolean;
}

export function SectionHeader({ title, to, chevron = false }: SectionHeaderProps) {
  const content = (
    <span className="flex items-center gap-1 border-l-2 border-primary pl-2">
      {title}
      {(to || chevron) && (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-3 w-3"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </span>
  );
  return to ? (
    <Link
      to={to}
      className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
    >
      {content}
    </Link>
  ) : (
    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {content}
    </h2>
  );
}
