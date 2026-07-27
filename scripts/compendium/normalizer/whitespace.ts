// Normalize whitespace in text content.
// Removes duplicated spaces, trims, normalizes line breaks.

export function normalizeWhitespace(text: unknown): string {
  if (typeof text !== "string") return "";
  return text
    .replace(/\r\n/g, "\n")
    .replace(/ +/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
