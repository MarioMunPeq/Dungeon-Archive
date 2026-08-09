import { forwardRef } from "react";
import type { CharacterSheetModel, ExportReferenceRow } from "./character-sheet-model";

const SHEET_WIDTH = 800;
const PAPER = "#f7f3ec";
const INK = "#241f1a";
const INK_SUBTLE = "#6f675c";
const LINE = "#d8d0c2";
const ACCENT = "#8a5a22";

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
      <span
        aria-hidden="true"
        style={{ width: 3, height: 14, borderRadius: 2, backgroundColor: ACCENT }}
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
            padding: "7px 0",
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

export interface CharacterSheetViewProps {
  readonly model: CharacterSheetModel;
}

export const CharacterSheetView = forwardRef<HTMLDivElement, CharacterSheetViewProps>(
  function CharacterSheetView({ model }, ref) {
    return (
      <div
        ref={ref}
        style={{
          width: SHEET_WIDTH,
          boxSizing: "border-box",
          padding: "40px 44px",
          backgroundColor: PAPER,
          color: INK,
        }}
      >
        <header style={{ borderBottom: `2px solid ${INK}`, paddingBottom: 18 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 700,
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

        <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 24 }}>
          <div
            style={{
              border: `1px solid ${LINE}`,
              borderRadius: 10,
              padding: "12px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: INK_SUBTLE,
                fontFamily: "var(--font-family-sans)",
              }}
            >
              Hit Points
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 22,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                color: INK,
                fontFamily: "var(--font-family-mono)",
              }}
            >
              {model.hitPoints.current}
              <span style={{ fontSize: 15, color: INK_SUBTLE }}> / {model.hitPoints.max}</span>
            </div>
          </div>
          <div
            style={{
              border: `1px solid ${LINE}`,
              borderRadius: 10,
              padding: "12px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: INK_SUBTLE,
                fontFamily: "var(--font-family-sans)",
              }}
            >
              Armor Class
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 22,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                color: INK,
                fontFamily: "var(--font-family-mono)",
              }}
            >
              {model.armorClass}
            </div>
          </div>
          <div
            style={{
              border: `1px solid ${LINE}`,
              borderRadius: 10,
              padding: "12px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: INK_SUBTLE,
                fontFamily: "var(--font-family-sans)",
              }}
            >
              Perception
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 22,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                color: INK,
                fontFamily: "var(--font-family-mono)",
              }}
            >
              {model.passivePerception}
            </div>
          </div>
          <div
            style={{
              border: `1px solid ${LINE}`,
              borderRadius: 10,
              padding: "12px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: INK_SUBTLE,
                fontFamily: "var(--font-family-sans)",
              }}
            >
              Spell DC
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 22,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                color: INK,
                fontFamily: "var(--font-family-mono)",
              }}
            >
              {model.spellSaveDc}
            </div>
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <SectionTitle>Abilities</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10 }}>
            {model.abilities.map((ability) => (
              <div
                key={ability.label}
                style={{
                  border: `1px solid ${LINE}`,
                  borderRadius: 10,
                  padding: "10px 6px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: INK_SUBTLE,
                    fontFamily: "var(--font-family-sans)",
                  }}
                >
                  {ability.label}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 20,
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                    color: INK,
                    fontFamily: "var(--font-family-mono)",
                  }}
                >
                  {ability.modifier >= 0 ? `+${ability.modifier}` : ability.modifier}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: INK_SUBTLE,
                    fontVariantNumeric: "tabular-nums",
                    fontFamily: "var(--font-family-mono)",
                  }}
                >
                  {ability.score}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <SectionTitle>Spells</SectionTitle>
          <ReferenceList rows={model.spells} empty="No spells." />
        </section>

        <section style={{ marginTop: 28 }}>
          <SectionTitle>Weapons</SectionTitle>
          <ReferenceList rows={model.weapons} empty="No weapons." />
        </section>

        <section style={{ marginTop: 28 }}>
          <SectionTitle>Magic Items</SectionTitle>
          <ReferenceList rows={model.magicItems} empty="No magic items." />
        </section>

        <footer
          style={{
            marginTop: 36,
            paddingTop: 14,
            borderTop: `1px solid ${LINE}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke={ACCENT}
            strokeWidth={2}
            style={{ width: 14, height: 14 }}
          >
            <path d="M4 19h16" />
            <path d="M4 19V6" />
            <path d="M20 19V6" />
            <path d="M4 6h16" />
            <path d="m9 19 6-6" />
            <path d="m15 19-6-6" />
          </svg>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
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
