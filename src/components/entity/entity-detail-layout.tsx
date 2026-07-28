import type { ReactNode } from "react";
import type { EntityVersion } from "@/compendium";
import { EntityHeader } from "./entity-header";
import { formatSource } from "@/compendium";

interface EntityDetailLayoutProps {
  readonly name: string;
  readonly subtitle: ReactNode;
  readonly source: string;
  readonly versions: readonly EntityVersion[];
  readonly onSourceChange: (source: string) => void;
  readonly children: ReactNode;
}

export function EntityDetailLayout({
  name,
  subtitle,
  source,
  versions,
  onSourceChange,
  children,
}: EntityDetailLayoutProps) {
  return (
    <article className="space-y-6 px-4 py-6">
      <EntityHeader name={name} subtitle={subtitle} source={source} />

      {versions.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {versions.map((v) => (
            <button
              key={v.source}
              type="button"
              onClick={() => onSourceChange(v.source)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                v.source === source
                  ? "border-foreground bg-accent font-medium text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/50"
              }`}
            >
              {formatSource(v.source)}
            </button>
          ))}
        </div>
      )}

      {children}
    </article>
  );
}
