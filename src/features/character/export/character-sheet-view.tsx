import { forwardRef } from "react";
import type { ReactNode } from "react";
import type {
  CharacterSheetModel,
  ExportAbilityRow,
  ExportReferenceRow,
} from "./character-sheet-model";
import { SHEET_BACKGROUND } from "./character-sheet-export";
import type { ExportSheetPalette } from "./character-sheet-export";

const SHEET_WIDTH = 800;
const INK = "#f5f1ec";
const INK_SUBTLE = "#928a81";
const LINE = "rgba(245, 241, 236, 0.09)";
const READOUT_GRADIENT =
  "radial-gradient(240% 260% at 50% 0%, #221d18 0%, #1c1917 50%, #171311 100%)";
const SUCCESS = "#58a374";
const DESTRUCTIVE = "#ef4444";

function modifierColor(modifier: number, palette: ExportSheetPalette): string {
  if (modifier > 0) return SUCCESS;
  if (modifier < 0) return DESTRUCTIVE;
  return palette.accentSecondary;
}

function D20Mark({ color, size }: { readonly color: string; readonly size: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 192 192"
      fill="none"
      stroke={color}
      strokeWidth={9}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, opacity: 0.85 }}
    >
      <polygon points="96,30 47,66 47,126 96,162 145,126 145,66" />
      <line x1="47" y1="66" x2="145" y2="66" />
      <line x1="47" y1="126" x2="145" y2="126" />
      <line x1="96" y1="66" x2="96" y2="126" />
      <line x1="96" y1="66" x2="47" y2="96" />
      <line x1="96" y1="66" x2="145" y2="96" />
      <line x1="47" y1="96" x2="96" y2="126" />
      <line x1="145" y1="96" x2="96" y2="126" />
    </svg>
  );
}

function SectionTitle({
  children,
  palette,
}: {
  readonly children: string;
  readonly palette: ExportSheetPalette;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
        paddingBottom: 8,
        borderBottom: `1px solid ${LINE}`,
      }}
    >
      <span
        aria-hidden="true"
        style={{ width: 3, height: 15, borderRadius: 2, backgroundColor: palette.accent }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: INK_SUBTLE,
          fontFamily: "var(--font-family-sans)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function ReferenceList({ rows, empty }: { rows: readonly ExportReferenceRow[]; empty: string }) {
  if (rows.length === 0) {
    return (
      <p
        style={{
          fontSize: 13,
          color: INK_SUBTLE,
          margin: 0,
          fontFamily: "var(--font-family-sans)",
        }}
      >
        {empty}
      </p>
    );
  }
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {rows.map((row) => (
        <li
          key={row.name}
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 16,
            padding: "8px 0",
            borderBottom: `1px solid ${LINE}`,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: INK,
              fontFamily: "var(--font-family-sans)",
            }}
          >
            {row.name}
          </span>
          <span
            style={{
              fontSize: 12,
              color: INK_SUBTLE,
              whiteSpace: "nowrap",
              fontFamily: "var(--font-family-mono)",
            }}
          >
            {row.meta}
          </span>
        </li>
      ))}
    </ul>
  );
}

function AbilityCard({
  ability,
  palette,
}: {
  readonly ability: ExportAbilityRow;
  readonly palette: ExportSheetPalette;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: "10px 6px",
        borderRadius: 10,
        border: `1px solid ${palette.accentBorder}`,
        background: READOUT_GRADIENT,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: INK_SUBTLE,
          fontFamily: "var(--font-family-sans)",
        }}
      >
        {ability.label}
      </span>
      <span
        style={{
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          color: modifierColor(ability.modifier, palette),
          fontFamily: "var(--font-family-mono)",
        }}
      >
        {ability.modifier >= 0 ? `+${ability.modifier}` : ability.modifier}
      </span>
      <span
        style={{
          fontSize: 11,
          color: INK_SUBTLE,
          fontVariantNumeric: "tabular-nums",
          fontFamily: "var(--font-family-mono)",
        }}
      >
        {ability.score}
      </span>
    </div>
  );
}

function StatCard({
  label,
  border,
  children,
}: {
  readonly label: string;
  readonly border: string;
  readonly children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "14px 10px",
        borderRadius: 12,
        border: `1px solid ${border}`,
        background: READOUT_GRADIENT,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: INK_SUBTLE,
          fontFamily: "var(--font-family-sans)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 24,
          fontWeight: 700,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          color: INK,
          fontFamily: "var(--font-family-mono)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

export interface CharacterSheetViewProps {
  readonly model: CharacterSheetModel;
  readonly palette: ExportSheetPalette;
}

export const CharacterSheetView = forwardRef<HTMLDivElement, CharacterSheetViewProps>(
  function CharacterSheetView({ model, palette }, ref) {
    return (
      <div
        ref={ref}
        style={{
          width: SHEET_WIDTH,
          boxSizing: "border-box",
          padding: "40px 44px",
          backgroundColor: SHEET_BACKGROUND,
          color: INK,
        }}
      >
        <header style={{ borderBottom: `1px solid ${LINE}`, paddingBottom: 18 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: INK,
              fontFamily: "var(--font-family-sans)",
            }}
          >
            {model.name}
          </h1>
          {model.classLine && (
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 14,
                fontWeight: 600,
                color: INK_SUBTLE,
                fontFamily: "var(--font-family-sans)",
              }}
            >
              {model.classLine}
            </p>
          )}
        </header>

        <section
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 24 }}
        >
          <StatCard label="Hit Points" border={palette.accentBorder}>
            {model.hitPoints.current}
            <span style={{ fontSize: 15, color: INK_SUBTLE }}> / {model.hitPoints.max}</span>
          </StatCard>
          <StatCard label="Armor Class" border={palette.accentBorder}>
            {String(model.armorClass)}
          </StatCard>
          <StatCard label="Perception" border={palette.accentBorder}>
            {String(model.passivePerception)}
          </StatCard>
          <StatCard label="Spell DC" border={palette.accentBorder}>
            {String(model.spellSaveDc)}
          </StatCard>
        </section>

        <section style={{ marginTop: 28 }}>
          <SectionTitle palette={palette}>Ability Scores</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
            {model.abilities.map((ability) => (
              <AbilityCard key={ability.label} ability={ability} palette={palette} />
            ))}
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <SectionTitle palette={palette}>Spells</SectionTitle>
          <ReferenceList rows={model.spells} empty="No spells." />
        </section>

        <section style={{ marginTop: 28 }}>
          <SectionTitle palette={palette}>Weapons</SectionTitle>
          <ReferenceList rows={model.weapons} empty="No weapons." />
        </section>

        <section style={{ marginTop: 28 }}>
          <SectionTitle palette={palette}>Magic Items</SectionTitle>
          <ReferenceList rows={model.magicItems} empty="No magic items." />
        </section>

        <footer
          style={{
            marginTop: 32,
            paddingTop: 16,
            borderTop: `1px solid ${LINE}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <D20Mark color={palette.accent} size={20} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: INK_SUBTLE,
              fontFamily: "var(--font-family-sans)",
            }}
          >
            Dungeon Archive
          </span>
        </footer>
      </div>
    );
  },
);
