import type { ContentBlock } from "@/types/content-block";

const ROLL_WITH_TYPE = /\b(\d+d\d+(?:\s*\+\s*\d+)?)\s+([A-Za-z]+)\s+damage\b/i;
const ROLL_BARE = /\b(\d+d\d+(?:\s*\+\s*\d+)?)\s+damage\b/i;

function blockText(block: ContentBlock): string {
  switch (block.type) {
    case "paragraph":
    case "header":
      return block.text;
    case "list":
      return block.items.map((item) => (typeof item === "string" ? item : blockText(item))).join(" ");
    case "entries":
    case "quote":
    case "inset":
      return block.blocks.map(blockText).join(" ");
    case "table":
      return block.rows.flatMap((row) => row.map((cell) => cell.text)).join(" ");
    default:
      return "";
  }
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function extractSpellRoll(blocks: readonly ContentBlock[]): string | undefined {
  for (const block of blocks) {
    const text = blockText(block);
    if (!text) continue;
    const withType = text.match(ROLL_WITH_TYPE);
    if (withType) return `${withType[1]} ${capitalize(withType[2]!)}`;
    const bare = text.match(ROLL_BARE);
    if (bare) return bare[1]!;
  }
  return undefined;
}
