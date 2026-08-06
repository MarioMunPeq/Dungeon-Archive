import type { ReactNode } from "react";

interface SectionProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly action?: ReactNode;
  readonly children?: ReactNode;
}

export function Section({ title, subtitle, action, children }: SectionProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h2 className="border-l-2 border-primary pl-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}
