export type ArchiveTabId = "search" | "how-to-play" | "rules" | "glossary";

export const ARCHIVE_TABS: readonly { id: ArchiveTabId; label: string }[] = [
  { id: "search", label: "Search" },
  { id: "how-to-play", label: "How to Play" },
  { id: "rules", label: "Rules" },
  { id: "glossary", label: "Glossary" },
];
