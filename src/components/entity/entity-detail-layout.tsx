import type { ReactNode } from "react";
import type { ContentBlock } from "@/compendium";
import { ContentRenderer } from "@/components/content";
import { EntityHeader } from "./entity-header";
import { MetadataGrid } from "./metadata-grid";
import { Section } from "./section";

interface MetadataField {
  readonly label: string;
  readonly value: string;
}

interface EntityDetailLayoutProps {
  readonly name: string;
  readonly subtitle: ReactNode;
  readonly source: string;
  readonly metadata: readonly MetadataField[];
  readonly description: readonly ContentBlock[];
  readonly descriptionTitle?: string;
  readonly sections?: ReadonlyArray<{
    readonly title: string;
    readonly blocks: readonly ContentBlock[];
  }>;
  readonly headerRight?: ReactNode;
}

export function EntityDetailLayout({
  name,
  subtitle,
  source,
  metadata,
  description,
  descriptionTitle = "Description",
  sections,
  headerRight,
}: EntityDetailLayoutProps) {
  return (
    <article className="space-y-6 px-4 py-6">
      <div className="flex items-start justify-between gap-4">
        <EntityHeader name={name} subtitle={subtitle} source={source} />
        {headerRight}
      </div>

      {metadata.length > 0 && <MetadataGrid fields={metadata} />}

      <Section title={descriptionTitle}>
        <ContentRenderer blocks={description} />
      </Section>

      {sections?.map((section) => (
        <Section key={section.title} title={section.title}>
          <ContentRenderer blocks={section.blocks} />
        </Section>
      ))}
    </article>
  );
}
