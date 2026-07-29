import type { ContentBlock } from "@/types/content-block";
import { ParagraphBlock } from "./paragraph-block";
import { HeaderBlock } from "./header-block";
import { EntriesBlock } from "./entries-block";
import { ListBlock } from "./list-block";
import { TableBlock } from "./table-block";
import { QuoteBlock } from "./quote-block";
import { InsetBlock } from "./inset-block";
import { SeparatorBlock } from "./separator-block";
import { ReferenceBlock } from "./reference-block";
import { DiceBlock } from "./dice-block";
import { LinkBlock } from "./link-block";
import { ImageBlock } from "./image-block";

interface BlockSwitchProps {
  readonly block: ContentBlock;
}

export function BlockSwitch({ block }: BlockSwitchProps) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock text={block.text} />;
    case "header":
      return <HeaderBlock text={block.text} level={block.level} />;
    case "entries":
      return <EntriesBlock name={block.name} blocks={block.blocks} />;
    case "list":
      return <ListBlock items={block.items} style={block.style} />;
    case "table":
      return <TableBlock headers={block.headers} rows={block.rows} caption={block.caption} />;
    case "quote":
      return <QuoteBlock blocks={block.blocks} by={block.by} />;
    case "inset":
      return <InsetBlock blocks={block.blocks} />;
    case "separator":
      return <SeparatorBlock />;
    case "reference":
      return <ReferenceBlock target={block.target} label={block.label} />;
    case "dice":
      return <DiceBlock formula={block.formula} label={block.label} />;
    case "link":
      return <LinkBlock href={block.href} text={block.text} />;
    case "image":
      return (
        <ImageBlock src={block.src} alt={block.alt} width={block.width} height={block.height} />
      );
  }
}
