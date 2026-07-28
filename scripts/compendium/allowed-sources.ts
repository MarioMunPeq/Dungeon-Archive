export const ALLOWED_SOURCES = new Set(["PHB", "XPHB", "TCE", "XGE", "MM", "XMM", "MPMM"]);

export function isAllowedSource(source: string): boolean {
  return ALLOWED_SOURCES.has(source);
}
