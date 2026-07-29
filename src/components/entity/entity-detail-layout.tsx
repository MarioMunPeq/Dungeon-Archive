import type { ReactNode } from "react";
import type { EntityVersion } from "@/compendium";
import { EntityHeader } from "./entity-header";
import { EntityBreadcrumbs } from "@/components/ui/breadcrumbs";
import { Inline } from "@/components/ui/Inline";
import { Stack } from "@/components/ui/Stack";
import { formatSource } from "@/compendium";

interface EntityDetailLayoutProps {
  readonly name: string;
  readonly subtitle: ReactNode;
  readonly source: string;
  readonly versions: readonly EntityVersion[];
  readonly onSourceChange: (source: string) => void;
  readonly children: ReactNode;
  readonly breadcrumbs?: readonly { label: string; to?: string }[];
}

export function EntityDetailLayout({
  name,
  subtitle,
  source,
  versions,
  onSourceChange,
  children,
  breadcrumbs,
}: EntityDetailLayoutProps) {
  return (
    <Stack as="article" gap="lg" className="px-4 py-6">
      {breadcrumbs && <EntityBreadcrumbs crumbs={breadcrumbs} />}

      <EntityHeader name={name} subtitle={subtitle} source={source} />

      {versions.length > 1 && (
        <Inline gap="xs">
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
        </Inline>
      )}

      {children}
    </Stack>
  );
}
