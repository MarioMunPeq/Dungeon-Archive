import { stripTags } from "./tags";
import { normalizeWhitespace } from "./whitespace";

export function normalizeText(text: unknown): string {
  return normalizeWhitespace(stripTags(text));
}
