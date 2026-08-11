import { cn } from "@/lib/utils";
import { ARCHIVE_TABS } from "./archive-tabs";
import type { ArchiveTabId } from "./archive-tabs";

function SearchGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function ArchiveTabBar({
  active,
  onChange,
}: {
  readonly active: ArchiveTabId;
  readonly onChange: (tab: ArchiveTabId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Archive sections"
      className="sticky top-14 z-30 border-b border-border bg-background/95 backdrop-blur-sm"
    >
      <div className="flex gap-1 px-2">
        {ARCHIVE_TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`archive-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`archive-panel-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={cn(
                "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground active:text-foreground",
              )}
            >
              {tab.id === "search" && <SearchGlyph />}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
