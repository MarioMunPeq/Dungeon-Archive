import { useSearchParams } from "react-router-dom";
import { SearchPage } from "@/features/search/search-page";
import { ArchiveTabBar } from "./archive-tab-bar";
import { ARCHIVE_TABS } from "./archive-tabs";
import type { ArchiveTabId } from "./archive-tabs";
import { GlossaryPane, HowToPlayPane, RulesPane } from "./rules-content";

const TAB_IDS: readonly ArchiveTabId[] = ARCHIVE_TABS.map((tab) => tab.id);

function resolveTab(raw: string | null): ArchiveTabId {
  return TAB_IDS.includes(raw as ArchiveTabId) ? (raw as ArchiveTabId) : "search";
}

export function ArchivePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = resolveTab(searchParams.get("tab"));

  const handleTabChange = (next: ArchiveTabId) => {
    const params = new URLSearchParams(searchParams);
    if (next === "search") {
      params.delete("tab");
    } else {
      params.set("tab", next);
    }
    setSearchParams(params, { replace: true });
  };

  const isRulesTab = tab === "how-to-play" || tab === "rules" || tab === "glossary";

  return (
    <div>
      <ArchiveTabBar active={tab} onChange={handleTabChange} />
      {tab === "search" && (
        <div id="archive-panel-search" role="tabpanel" aria-labelledby="archive-tab-search">
          <SearchPage />
        </div>
      )}
      {isRulesTab && (
        <div className="flex flex-col gap-3 px-4 py-4">
          {tab === "how-to-play" && <HowToPlayPane />}
          {tab === "rules" && <RulesPane />}
          {tab === "glossary" && <GlossaryPane />}
        </div>
      )}
    </div>
  );
}
