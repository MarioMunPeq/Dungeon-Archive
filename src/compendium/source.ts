export interface SourceInfo {
  readonly code: string;
  readonly name: string;
  readonly edition: string;
}

const SOURCE_MAP: Record<string, SourceInfo> = {
  XPHB: { code: "XPHB", name: "Player's Handbook", edition: "2024" },
  PHB: { code: "PHB", name: "Player's Handbook", edition: "2014" },
  TCE: { code: "TCE", name: "Tasha's Cauldron of Everything", edition: "2020" },
  XGE: { code: "XGE", name: "Xanathar's Guide to Everything", edition: "2017" },
};

const SOURCE_DISPLAY: Record<string, string> = {
  XPHB: "PHB24",
  PHB: "PHB",
  TCE: "TCE",
  XGE: "XGE",
};

export function getSourceInfo(source: string): SourceInfo | null {
  return SOURCE_MAP[source] ?? null;
}

export function formatSource(source: string): string {
  return SOURCE_DISPLAY[source] ?? source;
}

export function formatEdition(source: string): string {
  const info = SOURCE_MAP[source];
  return info ? `(${info.edition})` : "";
}
