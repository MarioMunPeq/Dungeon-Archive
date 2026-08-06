import type { ReactNode } from "react";

interface EmptyResultsProps {
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly action?: ReactNode;
}

export function EmptyResults({ title, description, action }: EmptyResultsProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description != null && (
        <div className="w-full max-w-md text-xs text-foreground-subtle">{description}</div>
      )}
      {action}
    </div>
  );
}
