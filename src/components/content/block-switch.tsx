import type { ContentBlock } from "@/compendium";
import { ParagraphBlock } from "./paragraph-block";
import { ListBlock } from "./list-block";
import { TableBlock } from "./table-block";
import { ReferenceBlock } from "@/features/compendium/renderers/reference-block";
import { ContentRenderer } from "./content-renderer";

interface BlockSwitchProps {
  readonly block: ContentBlock;
}

function HeaderBlock({ text, level }: { text: string; level?: number }) {
  const size =
    level === 1
      ? "text-lg font-bold"
      : level === 2
        ? "text-base font-semibold"
        : "text-sm font-semibold";
  return <p className={`${size} text-foreground`}>{text}</p>;
}

export function BlockSwitch({ block }: BlockSwitchProps) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock text={block.text} />;
    case "list":
      return <ListBlock items={block.items} />;
    case "table":
      return <TableBlock headers={block.headers} rows={block.rows} />;
    case "reference":
      return <ReferenceBlock target={block.target} label={block.label} />;
    case "header":
      return <HeaderBlock text={block.text} level={block.level} />;
    case "entries":
      return <ContentRenderer blocks={block.blocks} />;
  }
}
