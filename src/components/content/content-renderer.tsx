import type { ContentBlock } from "@/compendium";
import { BlockSwitch } from "./blocks/block-switch";

interface ContentRendererProps {
  readonly blocks: readonly ContentBlock[];
}

export function ContentRenderer({ blocks }: ContentRendererProps) {
  return (
    <div className="space-y-2">
      {blocks.map((block, i) => (
        <BlockSwitch key={i} block={block} />
      ))}
    </div>
  );
}
