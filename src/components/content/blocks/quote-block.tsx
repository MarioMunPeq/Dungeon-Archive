import type { ContentBlock } from "@/types/content-block";
import { BlockSwitch } from "./block-switch";

interface QuoteBlockProps {
  readonly blocks: readonly ContentBlock[];
  readonly by?: string;
}

export function QuoteBlock({ blocks, by }: QuoteBlockProps) {
  return (
    <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground my-3">
      <div className="space-y-3">
        {blocks.map((block, i) => (
          <BlockSwitch key={i} block={block} />
        ))}
      </div>
      {by && <p className="mt-2 text-xs not-italic text-muted-foreground/70">&mdash; {by}</p>}
    </blockquote>
  );
}
