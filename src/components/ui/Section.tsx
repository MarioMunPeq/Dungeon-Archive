import type { ReactNode } from "react";

interface SectionProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly children?: ReactNode;
}

export function Section({ title, subtitle, children }: SectionProps) {
  return (
    <section className="space-y-2">
      <div className="space-y-0.5">
        <h2 className="text-xs font-medium text-muted-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground/70">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
