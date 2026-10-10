import type { TranslationKey } from "@/i18n";

export type ArchiveTabId = "search" | "how-to-play" | "rules" | "glossary";

export const ARCHIVE_TABS: readonly { id: ArchiveTabId; label: TranslationKey }[] = [
  { id: "search", label: "tab.search" },
  { id: "how-to-play", label: "tab.howToPlay" },
  { id: "rules", label: "tab.rules" },
  { id: "glossary", label: "tab.glossary" },
];
