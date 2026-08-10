export const SHEET_BACKGROUND = "#12100e";

export interface ExportSheetPalette {
  readonly accent: string;
  readonly accentSecondary: string;
  readonly accentBorder: string;
}

export function readThemePalette(): ExportSheetPalette {
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue("--theme-accent").trim();
  const accentSecondary = styles.getPropertyValue("--theme-accent-secondary").trim();
  const accentBorder = styles.getPropertyValue("--theme-accent-border").trim();
  return {
    accent: accent || "#3ab492",
    accentSecondary: accentSecondary || "#7fbfaa",
    accentBorder: accentBorder || "rgb(58 180 146 / 0.15)",
  };
}
