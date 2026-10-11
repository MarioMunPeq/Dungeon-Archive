import { useCallback, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button, useSnackbar } from "@/components/ui";
import { resolveEntity } from "@/compendium";
import type { Equipment, MagicItem, Spell } from "@/compendium";
import { useTheme } from "@/user-state";
import type { CharacterReference } from "@/user-state";
import { buildCharacterSheetModel, exportFileName } from "./character-sheet-model";
import { CharacterSheetView } from "./character-sheet-view";
import { readThemePalette, SHEET_BACKGROUND } from "./character-sheet-export";
import { t } from "@/i18n";

function resolveSpells(ids: readonly string[]): Spell[] {
  const out: Spell[] = [];
  for (const canonicalId of ids) {
    const resolved = resolveEntity(canonicalId);
    if (resolved?.selected.category === "spell") out.push(resolved.selected);
  }
  return out;
}

function resolveWeapons(ids: readonly string[]): Equipment[] {
  const out: Equipment[] = [];
  for (const canonicalId of ids) {
    const resolved = resolveEntity(canonicalId);
    if (resolved?.selected.category === "equipment") out.push(resolved.selected);
  }
  return out;
}

function resolveMagicItems(ids: readonly string[]): MagicItem[] {
  const out: MagicItem[] = [];
  for (const canonicalId of ids) {
    const resolved = resolveEntity(canonicalId);
    if (resolved?.selected.category === "magicitem") out.push(resolved.selected);
  }
  return out;
}

export function ExportSheetButton({ character }: { character: CharacterReference }) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [exporting, setExporting] = useState(false);
  // The off-screen sheet is only needed to capture a PNG, but it was mounted on
  // every render of the character page — a few hundred DOM nodes rebuilt on each
  // HP edit. It is mounted on the first export and then kept, so repeated exports
  // are instant.
  const [sheetMounted, setSheetMounted] = useState(false);
  const { show } = useSnackbar();
  const theme = useTheme();

  const model = useMemo(
    () =>
      buildCharacterSheetModel(
        character,
        resolveSpells(character.knownSpellCanonicalIds),
        resolveWeapons(character.weaponCanonicalIds),
        resolveMagicItems(character.magicItemCanonicalIds),
      ),
    [character],
  );

  // `readThemePalette` forces a synchronous style recalc, so it must not run on
  // every render — only when the accent theme actually changes.
  const palette = useMemo(() => readThemePalette(), [theme]);

  const handleExport = useCallback(async () => {
    setExporting(true);
    setSheetMounted(true);
    // The sheet may have just mounted; wait for it to commit and paint with the
    // live theme accent before capture.
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    const node = sheetRef.current;
    if (!node) {
      setExporting(false);
      return;
    }
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        backgroundColor: SHEET_BACKGROUND,
      });
      const link = document.createElement("a");
      link.download = exportFileName(model.name);
      link.href = dataUrl;
      link.click();
      show(t("export.success"), { tone: "success" });
    } catch (e) {
      console.error("[export] failed:", e);
      show(t("export.failed"), { tone: "error" });
    } finally {
      setExporting(false);
    }
  }, [model.name, show]);

  return (
    <>
      {sheetMounted && (
        <div aria-hidden className="pointer-events-none fixed -left-[9999px] top-0">
          <CharacterSheetView ref={sheetRef} model={model} palette={palette} />
        </div>
      )}
      <Button variant="outline" size="sm" onClick={() => void handleExport()} disabled={exporting}>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-4 w-4"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {exporting ? t("export.exporting") : t("export.action")}
      </Button>
    </>
  );
}
