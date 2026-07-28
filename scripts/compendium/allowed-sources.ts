// Single source of truth for allowed sources.
// Transformers MUST NOT hardcode sources.
// Add or remove sources here only.

export const ALLOWED_SOURCES = new Set(["PHB", "XPHB", "TCE", "XGE"]);

export function isAllowedSource(source: string): boolean {
  return ALLOWED_SOURCES.has(source);
}
