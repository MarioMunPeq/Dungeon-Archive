// Strip 5etools inline tags: {@spell Fireball} → Fireball
// {@damage 2d6 + 5} → 2d6 + 5
// {@dc 14} → DC 14
// {@hit 4} → +4

const TAG_PATTERN = /\{@(\w+)\s*([^}]*)\}/g;

function formatTagContent(tag: string, content: string): string {
  switch (tag) {
    case "hit":
      return `+${content}`;
    case "dc":
      return `DC ${content}`;
    case "damage":
    case "dice":
      return content;
    case "b":
    case "bold":
      return `**${content}**`;
    case "i":
    case "italic":
      return `_${content}_`;
    default:
      return content.split("|")[0]!;
  }
}

export function stripTags(text: unknown): string {
  if (typeof text !== "string") return "";
  return text.replace(TAG_PATTERN, (_match, tag: string, content: string) => {
    return formatTagContent(tag, content);
  });
}
