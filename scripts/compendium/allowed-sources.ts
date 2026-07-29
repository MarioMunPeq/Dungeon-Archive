export const ALLOWED_SOURCES = new Set([
  "PHB", "XPHB", "TCE", "XGE", "MM", "XMM", "MPMM", "DMG", "XDMG",
]);

export function isAllowedSource(source: string): boolean {
  return ALLOWED_SOURCES.has(source);
}
