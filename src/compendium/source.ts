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
  MM: { code: "MM", name: "Monster Manual", edition: "2014" },
  XMM: { code: "XMM", name: "Monster Manual", edition: "2025" },
  MPMM: { code: "MPMM", name: "Mordenkainen's Monsters of the Multiverse", edition: "2022" },
  DMG: { code: "DMG", name: "Dungeon Master's Guide", edition: "2014" },
  XDMG: { code: "XDMG", name: "Dungeon Master's Guide", edition: "2024" },
};

const SOURCE_DISPLAY: Record<string, string> = {
  XPHB: "PHB 2024",
  PHB: "PHB 2014",
  XMM: "MM 2025",
  MM: "MM 2014",
  XDMG: "DMG 2024",
  DMG: "DMG 2014",
  TCE: "TCE",
  XGE: "XGE",
  MPMM: "MPMM",
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
