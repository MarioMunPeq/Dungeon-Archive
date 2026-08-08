import type { ContentBlock } from "@/types/content-block";
import { BlockSwitch } from "./block-switch";

interface ListBlockProps {
  readonly items: readonly (string | ContentBlock)[];
  readonly style?: string;
}

export function ListBlock({ items, style }: ListBlockProps) {
  const disc = style === "none" || style === "unstyled" ? "" : "list-disc";
  return (
    <ul className={`${disc} space-y-1 pl-5 text-sm leading-relaxed text-foreground`}>
      {items.map((item, i) => (
        <li key={i}>{typeof item === "string" ? item : <BlockSwitch block={item} />}</li>
      ))}
    </ul>
  );
}
