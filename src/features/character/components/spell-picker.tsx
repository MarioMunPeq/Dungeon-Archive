import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  buildFilterDefs,
  formatSchool,
  getEntitiesForCategory,
  METADATA_SEPARATOR,
  spellLevelLabel,
} from "@/compendium";
import type { Spell } from "@/compendium";
import { EmptyResults, FilterChips } from "@/components/search";
import { ScrollElementProvider, VirtualList } from "@/components/virtual";
import { useDialog } from "@/components/ui/use-dialog";
import { Button } from "@/components/ui/Button";
import { SearchField } from "@/components/ui/SearchField";
import { HelpTip } from "@/components/ui/HelpTip";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { countClassSpells, filterSpellCandidates } from "@/features/character/spell-picker-model";
import type { SpellPickerFilterValues } from "@/features/character/spell-picker-model";
import { t } from "@/i18n";
import { useLanguage } from "@/user-state";

type SpellScope = "mine" | "all";

interface ActiveFilterEntry {
  readonly key: string;
  readonly value: string;
  readonly label: string;
}

const FILTER_KEYS = ["level", "school", "concentration", "ritual", "class"] as const;

interface SpellPickerContentProps {
  readonly characterClass: string;
  readonly selectedIds: readonly string[];
  readonly onToggle: (canonicalId: string) => void;
  readonly onClose: () => void;
  /** Test seams: initial UI state for static-render tests. */
  readonly initialQuery?: string;
  readonly initialScope?: SpellScope;
}

export function SpellPickerContent({
  characterClass,
  selectedIds,
  onToggle,
  onClose,
  initialQuery = "",
  initialScope,
}: SpellPickerContentProps) {
  const spells = useMemo(() => getEntitiesForCategory("spell") as readonly Spell[], []);
  // Filter labels are localized inside buildFilterDefs, so the language has to
  // be a dependency or a language switch would leave stale labels behind.
  const language = useLanguage();
  // `language` looks redundant to the lint rule, but the labels are produced
  // inside buildFilterDefs through the store-aware t(), which the rule cannot
  // see. Without it a language switch would keep the previous language's chips.
  /* eslint-disable react-hooks/exhaustive-deps -- `language` drives localized labels built via the store-aware t() */
  const filterDefs = useMemo(
    () => new Map(buildFilterDefs("spell", spells).map((def) => [def.key, def] as const)),
    [spells, language],
  );
  /* eslint-enable react-hooks/exhaustive-deps */

  const hasClass = characterClass.trim().length > 0;
  const classSpellCount = useMemo(
    () => countClassSpells(spells, characterClass),
    [spells, characterClass],
  );
  const [scope, setScope] = useState<SpellScope>(
    () => initialScope ?? (hasClass && classSpellCount > 0 ? "mine" : "all"),
  );
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SpellPickerFilterValues>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () =>
      filterSpellCandidates(spells, {
        query,
        characterClass: scope === "mine" ? characterClass : null,
        filters,
      }),
    [spells, query, scope, characterClass, filters],
  );

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const activeEntries = useMemo(
    () =>
      FILTER_KEYS.map((key): ActiveFilterEntry | null => {
        const value = filters[key] ?? "";
        if (!value) return null;
        const label = filterDefs.get(key)?.options.find((o) => o.value === value)?.label ?? value;
        return { key, value, label };
      }).filter((entry): entry is ActiveFilterEntry => Boolean(entry)),
    [filters, filterDefs],
  );
  const clearFilter = (key: string) =>
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key as keyof SpellPickerFilterValues];
      return next;
    });
  const clearAllFilters = () => setFilters({});

  const levelDef = filterDefs.get("level");
  const schoolDef = filterDefs.get("school");
  const concentrationDef = filterDefs.get("concentration");
  const ritualDef = filterDefs.get("ritual");
  const classDef = filterDefs.get("class");
  const advancedGroups = useMemo(
    () =>
      [
        schoolDef && { def: schoolDef, help: t("help.spellSchool.body") },
        classDef && scope !== "mine" && { def: classDef, help: null },
        concentrationDef && { def: concentrationDef, help: null },
        ritualDef && { def: ritualDef, help: null },
      ].filter((group): group is { def: NonNullable<typeof schoolDef>; help: string | null } =>
        Boolean(group),
      ),
    [schoolDef, classDef, scope, concentrationDef, ritualDef],
  );

  const hasQueryOrFilters = query.trim().length > 0 || activeEntries.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("spellPicker.title")}
      className="fixed inset-0 z-50 flex flex-col bg-card animate-slide-up"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <h2 className="flex-1 text-base font-semibold text-foreground">
          {t("category.spell.many")}
        </h2>
        {selectedIds.length > 0 && (
          <span
            className="text-xs text-muted-foreground"
            aria-label={t("spellPicker.knownCount", { count: selectedIds.length })}
          >
            {t("spellPicker.knownCount", { count: selectedIds.length })}
          </span>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label={t("spellPicker.close")}
          className="hitbox-expand relative inline-flex h-8 w-8 items-center justify-center rounded-control text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3 border-b border-border px-4 py-3">
        <SearchField
          value={query}
          onChange={setQuery}
          autoFocus
          placeholder={t("spellPicker.searchPlaceholder")}
          ariaLabel={t("spellPicker.searchLabel")}
        />
        {hasClass && (
          <div className="flex items-center gap-2">
            <FilterChips
              options={[
                { value: "mine", label: t("spellPicker.forClass", { class: characterClass }) },
                { value: "all", label: t("spellPicker.allSpells") },
              ]}
              selected={scope}
              onChange={(next) => setScope(next === "mine" ? "mine" : "all")}
              ariaLabel={t("spellPicker.whichToShow")}
              allowDeselect={false}
            />
            <HelpTip label={t("spellPicker.aboutList")}>
              {t("spellPicker.aboutListBody", { class: characterClass })}
            </HelpTip>
          </div>
        )}
        {levelDef && (
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {t("filter.level")}
            </span>
            <FilterChips
              options={levelDef.options}
              selected={filters.level ?? ""}
              onChange={(next) => setFilters((prev) => ({ ...prev, level: next }))}
              ariaLabel={t("spellPicker.levelLabel")}
            />
          </div>
        )}
        {activeEntries.length > 0 && (
          <div className="flex items-center gap-2">
            {activeEntries.map((entry) => (
              <button
                key={entry.key}
                type="button"
                onClick={() => clearFilter(entry.key)}
                aria-label={t("spellPicker.removeFilter", {
                  label: filterDefs.get(entry.key)?.label ?? entry.key,
                  value: entry.label,
                })}
                className="inline-flex max-w-full shrink-0 items-center gap-1 rounded-control border border-border bg-accent py-1 pl-2 pr-1.5 text-xs text-foreground transition-all duration-150 active:scale-95"
              >
                <span className="text-muted-foreground">
                  {filterDefs.get(entry.key)?.label ?? entry.key}
                </span>
                <span className="max-w-[10rem] truncate">{entry.label}</span>
                <CloseIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
              </button>
            ))}
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              {t("common.clearAll")}
            </Button>
          </div>
        )}
        {advancedGroups.map(({ def, help }) => (
          <div key={def.key} className="flex min-w-0 flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              {def.label}
              {help && <HelpTip label={t("common.about", { subject: def.label })}>{help}</HelpTip>}
            </span>
            <FilterChips
              options={def.options}
              selected={filters[def.key as keyof SpellPickerFilterValues] ?? ""}
              onChange={(next) => setFilters((prev) => ({ ...prev, [def.key]: next }))}
              ariaLabel={def.label}
              wrap
            />
          </div>
        ))}
      </div>

      <p className="px-4 pt-2 text-xs text-muted-foreground" role="status">
        {t("spellPicker.resultCount", { count: results.length })}
      </p>

      <div className="relative min-h-0 flex-1">
        <ScrollElementProvider elementRef={scrollRef}>
          <div ref={scrollRef} className="absolute inset-0 overflow-y-auto overscroll-contain">
            {results.length === 0 ? (
              <EmptyResults
                title={
                  hasQueryOrFilters
                    ? t("spellPicker.emptyWithFilters")
                    : t("spellPicker.emptyForClass", { class: characterClass })
                }
                description={
                  hasQueryOrFilters
                    ? t("spellPicker.emptyWithFiltersBody")
                    : t("spellPicker.emptyForClassBody")
                }
                action={
                  hasQueryOrFilters ? (
                    <Button variant="outline" size="sm" onClick={clearAllFilters}>
                      {t("filter.clear")}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setScope("all")}>
                      {t("spellPicker.showAll")}
                    </Button>
                  )
                }
              />
            ) : (
              <VirtualList
                items={results}
                divide
                getItemKey={(spell) => spell.canonicalId}
                estimateRowHeight={64}
                renderItem={(spell) => (
                  <SpellRow
                    spell={spell}
                    selected={selectedSet.has(spell.canonicalId)}
                    onToggle={onToggle}
                  />
                )}
              />
            )}
          </div>
        </ScrollElementProvider>
      </div>

      <div className="border-t border-border px-4 py-3">
        <Button className="w-full" onClick={onClose}>
          {t("common.done")}
        </Button>
      </div>
    </div>
  );
}

function SpellRow({
  spell,
  selected,
  onToggle,
}: {
  spell: Spell;
  selected: boolean;
  onToggle: (canonicalId: string) => void;
}) {
  const levelText = spellLevelLabel(spell.level);
  const parts = [
    levelText,
    formatSchool(spell.school),
    spell.concentration ? t("spell.abbrev.concentration") : null,
    spell.ritual ? t("spell.abbrev.ritual") : null,
  ].filter(Boolean);
  return (
    <button
      type="button"
      onClick={() => onToggle(spell.canonicalId)}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150",
        selected ? "bg-accent/40" : "hover:bg-accent/50",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">{spell.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {parts.join(` ${METADATA_SEPARATOR} `)}
        </span>
      </span>
      {selected && <CheckIcon className="h-4 w-4 shrink-0 text-primary" />}
    </button>
  );
}

interface SpellPickerProps {
  readonly characterClass: string;
  readonly selectedIds: readonly string[];
  readonly onToggle: (canonicalId: string) => void;
  readonly onClose: () => void;
}

export function SpellPicker(props: SpellPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useDialog({ onClose: props.onClose, open: true, containerRef, focusFirst: false });

  return createPortal(
    <div ref={containerRef} className="contents">
      <SpellPickerContent {...props} />
    </div>,
    document.body,
  );
}
