import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePlayerReferences, userStore } from "@/user-state";
import type { PlayerReference, PlayerReferenceUpdate } from "@/user-state";
import { getEntitiesForCategory, SCHOOL_NAMES, resolveEntity } from "@/compendium";
import type { ContentBlock, Equipment, MagicItem, Spell } from "@/compendium";
import { entityRefFromCanonicalId, EntityReferenceRow, RowRemoveButton } from "@/components/entity";
import { ReferencePicker } from "@/components/ui/ReferencePicker";
import type { PickerCandidate } from "@/components/ui/ReferencePicker";
import { InlineTextEditor } from "@/components/ui/InlineTextEditor";
import { InlineTextareaEditor } from "@/components/ui/InlineTextareaEditor";
import { Button, SelectField, Stepper } from "@/components/ui";
import { cn } from "@/lib/utils";

type PickerKind = "spell" | "weapon" | "magicitem";

const PICKER_TITLES: Record<PickerKind, string> = {
  spell: "Known Spells",
  weapon: "Weapons",
  magicitem: "Magic Items",
};

const WEAPON_TYPES = new Set(["Melee Weapon", "Ranged Weapon"]);

type AbilityKey = keyof PlayerReference["abilityModifiers"];

const ABILITY_LABELS: Record<AbilityKey, string> = {
  strength: "STR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA",
};

const ABILITY_KEYS: AbilityKey[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

const CLASSES = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
  "Artificer",
] as const;

const SUBCLASSES: Record<string, readonly string[]> = {
  Barbarian: ["Berserker", "Wild Heart", "World Tree", "Zealot"],
  Bard: [
    "College of Dance",
    "College of Glamour",
    "College of Lore",
    "College of Valor",
    "College of Whispers",
    "College of Swords",
  ],
  Cleric: [
    "Life Domain",
    "Light Domain",
    "Trickery Domain",
    "War Domain",
    "Knowledge Domain",
    "Nature Domain",
    "Tempest Domain",
    "Twilight Domain",
    "Forge Domain",
  ],
  Druid: [
    "Circle of the Land",
    "Circle of the Moon",
    "Circle of the Sea",
    "Circle of the Stars",
    "Circle of Wildfire",
  ],
  Fighter: [
    "Battle Master",
    "Champion",
    "Eldritch Knight",
    "Psi Warrior",
    "Arcane Archer",
    "Samurai",
  ],
  Monk: [
    "Way of the Open Hand",
    "Way of Shadow",
    "Way of the Four Elements",
    "Way of Mercy",
    "Way of the Astral Self",
    "Way of the Kensei",
  ],
  Paladin: [
    "Oath of Devotion",
    "Oath of the Ancients",
    "Oath of Vengeance",
    "Oath of Conquest",
    "Oath of Redemption",
    "Oath of Glory",
    "Oath of the Watchers",
  ],
  Ranger: [
    "Hunter",
    "Beast Master",
    "Fey Wanderer",
    "Gloom Stalker",
    "Horizon Walker",
    "Swarmkeeper",
    "Drakewarden",
  ],
  Rogue: [
    "Thief",
    "Assassin",
    "Arcane Trickster",
    "Soulknife",
    "Phantom",
    "Inquisitive",
    "Swashbuckler",
  ],
  Sorcerer: [
    "Draconic Bloodline",
    "Wild Magic",
    "Aberrant Mind",
    "Clockwork Soul",
    "Divine Soul",
    "Shadow Magic",
  ],
  Warlock: [
    "The Archfey",
    "The Fiend",
    "The Great Old One",
    "The Celestial",
    "The Hexblade",
    "The Genie",
    "The Undead",
    "The Fathomless",
  ],
  Wizard: [
    "Evocation",
    "Abjuration",
    "Conjuration",
    "Divination",
    "Enchantment",
    "Illusion",
    "Necromancy",
    "Transmutation",
    "Bladesinging",
    "War Magic",
  ],
  Artificer: ["Alchemist", "Artillerist", "Battle Smith", "Armorer"],
};

function buildCandidates(kind: PickerKind): PickerCandidate[] {
  const seen = new Set<string>();
  const out: PickerCandidate[] = [];
  const push = (candidate: PickerCandidate): void => {
    if (seen.has(candidate.canonicalId)) return;
    seen.add(candidate.canonicalId);
    out.push(candidate);
  };
  switch (kind) {
    case "spell": {
      for (const s of getEntitiesForCategory("spell") as readonly Spell[]) {
        push({
          canonicalId: s.canonicalId,
          name: s.name,
          subtitle: `${s.level === 0 ? "Cantrip" : `Level ${s.level}`} \u00B7 ${SCHOOL_NAMES[s.school] ?? s.school}`,
        });
      }
      break;
    }
    case "weapon": {
      for (const e of getEntitiesForCategory("equipment") as readonly Equipment[]) {
        if (!WEAPON_TYPES.has(e.type)) continue;
        const dmg = [e.damage, e.damageType].filter(Boolean).join(" ");
        push({
          canonicalId: e.canonicalId,
          name: e.name,
          subtitle: dmg ? `${e.type} \u00B7 ${dmg}` : e.type,
        });
      }
      break;
    }
    case "magicitem": {
      for (const m of getEntitiesForCategory("magicitem") as readonly MagicItem[]) {
        push({ canonicalId: m.canonicalId, name: m.name, subtitle: m.rarity });
      }
      break;
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

function weaponStats(canonicalId: string): string | undefined {
  const resolved = resolveEntity(canonicalId);
  if (!resolved || resolved.selected.category !== "equipment") return undefined;
  const item = resolved.selected as Equipment;
  const damage = [item.damage, item.damageType].filter(Boolean).join(" ");
  return damage || undefined;
}

function spellSubtitle(entity: Spell | undefined): string | undefined {
  if (!entity) return undefined;
  const levelText = entity.level === 0 ? "Cantrip" : `Level ${entity.level}`;
  return `${levelText} \u00B7 ${SCHOOL_NAMES[entity.school] ?? entity.school}`;
}

function weaponSubtitle(entity: Equipment | undefined): string | undefined {
  if (!entity) return undefined;
  return entity.type;
}

function firstParagraphText(blocks: readonly ContentBlock[]): string | undefined {
  for (const block of blocks) {
    if (block.type === "paragraph" && block.text.trim()) return block.text;
    if (block.type === "entries") {
      const inner = firstParagraphText(block.blocks);
      if (inner) return inner;
    }
    if (block.type === "list") {
      const item = block.items.find((i) => typeof i === "string" && i.trim());
      if (typeof item === "string") return item;
    }
    if (block.type === "inset" || block.type === "quote") {
      const inner = firstParagraphText(block.blocks);
      if (inner) return inner;
    }
  }
  return undefined;
}

function WeaponPreview({ item, href }: { item: Equipment; href: string }) {
  const damage = [item.damage, item.damageType].filter(Boolean).join(" ");
  const properties = item.properties ?? [];
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-card px-3 py-2 animate-slide-up">
      {damage && <p className="text-base font-bold tabular-nums text-foreground">{damage}</p>}
      {properties.length > 0 && (
        <p className="text-xs text-foreground-subtle">{properties.join(" \u00B7 ")}</p>
      )}
      <Link
        to={href}
        className="self-start text-xs font-medium text-primary transition-colors duration-150 hover:underline"
      >
        Open in Compendium
      </Link>
    </div>
  );
}

function SpellPreview({ spell, href }: { spell: Spell; href: string }) {
  const levelText = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;
  const school = SCHOOL_NAMES[spell.school] ?? spell.school;
  const summary = firstParagraphText(spell.description);
  const flags = [spell.concentration && "Concentration", spell.ritual && "Ritual"].filter(
    Boolean,
  ) as string[];
  const rest = [spell.castingTime, spell.range, spell.duration].filter(Boolean);
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-card px-3 py-2 animate-slide-up">
      <p className="text-xs leading-relaxed">
        <span className="font-semibold text-foreground">
          {levelText} \u00B7 {school}
        </span>
        {rest.length > 0 && (
          <span className="text-foreground-subtle"> \u00B7 {rest.join(" \u00B7 ")}</span>
        )}
      </p>
      {flags.length > 0 && (
        <div className="flex items-center gap-1">
          {flags.map((flag) => (
            <span
              key={flag}
              className="rounded-full border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              {flag}
            </span>
          ))}
        </div>
      )}
      {summary && <p className="line-clamp-2 text-xs text-muted-foreground">{summary}</p>}
      <Link
        to={href}
        className="self-start text-xs font-medium text-primary transition-colors duration-150 hover:underline"
      >
        Open in Compendium
      </Link>
    </div>
  );
}

function createEmptyReference(): Omit<PlayerReference, "id"> {
  return {
    name: "New Player",
    class: "",
    level: 1,
    subclass: undefined,
    abilityModifiers: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    note: undefined,
  };
}

function ValueLabel({ children, onClear }: { children: string; onClear?: () => void }) {
  return (
    <div className={cn("flex w-full items-center", onClear ? "justify-between" : "justify-center")}>
      <span className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {children}
      </span>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={`Clear ${children}`}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground active:scale-90"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="h-3 w-3"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

function NumberCell({
  label,
  value,
  min,
  max,
  format,
  onChange,
  onClear,
  valueClassName,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  format?: (value: number) => string;
  onChange: (value: number) => void;
  onClear?: () => void;
  valueClassName?: string;
}) {
  return (
    <div className="group flex min-w-0 flex-col items-center gap-0.5">
      <ValueLabel onClear={onClear}>{label}</ValueLabel>
      <Stepper
        variant="ghost"
        hiddenControls
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        label={label}
        format={format}
        valueClassName={valueClassName}
      />
    </div>
  );
}

function OptionalNumberCell({
  label,
  value,
  min,
  max,
  format,
  initial,
  onCommit,
  valueClassName,
}: {
  label: string;
  value: number | undefined;
  min: number;
  max: number;
  format?: (value: number) => string;
  initial: number;
  onCommit: (value: number | undefined) => void;
  valueClassName?: string;
}) {
  if (value === undefined) {
    return (
      <div className="flex min-w-0 flex-col items-center gap-0.5">
        <ValueLabel>{label}</ValueLabel>
        <button
          type="button"
          onClick={() => onCommit(initial)}
          aria-label={`Set ${label}`}
          className="hitbox-expand flex h-9 w-full select-none items-center justify-center rounded-md text-muted-foreground transition-all duration-150 hover:text-foreground active:scale-95"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="h-4 w-4"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    );
  }
  return (
    <NumberCell
      label={label}
      value={value}
      min={min}
      max={max}
      format={format}
      onChange={(next) => onCommit(next)}
      onClear={() => onCommit(undefined)}
      valueClassName={valueClassName}
    />
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="h-3.5 w-3.5"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      {label}
    </Button>
  );
}

function ReferenceRow({
  canonicalId,
  kind,
  onRemove,
  quickStats,
}: {
  canonicalId: string;
  kind: PickerKind;
  onRemove: (id: string) => void;
  quickStats?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const resolved = useMemo(() => resolveEntity(canonicalId), [canonicalId]);
  const ref = entityRefFromCanonicalId(canonicalId);
  if (!ref) return null;

  const selected = resolved?.selected;
  const previewable = kind !== "magicitem";

  const subtitle =
    kind === "spell" && selected?.category === "spell"
      ? spellSubtitle(selected)
      : kind === "weapon" && selected?.category === "equipment"
        ? weaponSubtitle(selected)
        : kind === "magicitem" && selected?.category === "magicitem"
          ? selected.rarity
          : undefined;

  const handleRemove = () => {
    setLeaving(true);
    window.setTimeout(() => onRemove(canonicalId), 150);
  };

  return (
    <div className={cn("flex flex-col", leaving ? "animate-fade-out" : "animate-fade-in")}>
      <EntityReferenceRow
        canonicalId={canonicalId}
        subtitle={subtitle}
        showBadge={false}
        className="py-1"
        trailing={
          quickStats ? (
            <span className="shrink-0 rounded-md bg-card px-1.5 py-0.5 text-xs font-semibold tabular-nums text-foreground">
              {quickStats}
            </span>
          ) : undefined
        }
        action={<RowRemoveButton label={`Remove ${ref.name}`} onClick={handleRemove} />}
        asLink={!previewable}
        onToggle={previewable ? () => setExpanded((v) => !v) : undefined}
        expanded={previewable ? expanded : undefined}
      />
      {previewable && expanded && selected?.category === "spell" && (
        <SpellPreview spell={selected} href={ref.href} />
      )}
      {previewable && expanded && selected?.category === "equipment" && (
        <WeaponPreview item={selected} href={ref.href} />
      )}
    </div>
  );
}

function ReferenceGroup({
  title,
  kind,
  ids,
  onAdd,
  onRemove,
  getQuickStats,
}: {
  title: string;
  kind: PickerKind;
  ids: string[];
  onAdd: () => void;
  onRemove: (canonicalId: string) => void;
  getQuickStats?: (canonicalId: string) => string | undefined;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <AddButton label="Add" onClick={onAdd} />
      </div>
      {ids.length === 0 ? (
        <p className="px-1 text-xs text-foreground-subtle">None</p>
      ) : (
        <div className="flex flex-col">
          {ids.map((canonicalId) => (
            <ReferenceRow
              key={canonicalId}
              canonicalId={canonicalId}
              kind={kind}
              onRemove={onRemove}
              quickStats={getQuickStats?.(canonicalId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PlayerReferenceCard({
  reference,
  autoEditName,
}: {
  reference: PlayerReference;
  autoEditName: boolean;
}) {
  const [editing, setEditing] = useState<"name" | "note" | null>(autoEditName ? "name" : null);
  const [draft, setDraft] = useState("");
  const [picker, setPicker] = useState<PickerKind | null>(null);

  const candidates = useMemo(() => (picker ? buildCandidates(picker) : []), [picker]);

  const update = useCallback(
    (data: PlayerReferenceUpdate) => {
      userStore.getState().updatePlayerReference(reference.id, data);
    },
    [reference.id],
  );

  const startEdit = useCallback(
    (field: "name" | "note") => {
      setDraft(field === "name" ? reference.name : (reference.note ?? ""));
      setEditing(field);
    },
    [reference],
  );

  const commitText = useCallback(
    (field: "name" | "note", raw: string) => {
      update(field === "name" ? { name: raw } : { note: raw });
      setEditing(null);
    },
    [update],
  );

  const addReference = useCallback(
    (kind: PickerKind, canonicalId: string) => {
      if (kind === "spell") {
        if (!reference.knownSpellCanonicalIds.includes(canonicalId)) {
          update({ knownSpellCanonicalIds: [...reference.knownSpellCanonicalIds, canonicalId] });
        }
      } else if (kind === "weapon") {
        if (!reference.weaponCanonicalIds.includes(canonicalId)) {
          update({ weaponCanonicalIds: [...reference.weaponCanonicalIds, canonicalId] });
        }
      } else if (!reference.magicItemCanonicalIds.includes(canonicalId)) {
        update({ magicItemCanonicalIds: [...reference.magicItemCanonicalIds, canonicalId] });
      }
      setPicker(null);
    },
    [reference, update],
  );

  const removeReference = useCallback(
    (kind: PickerKind, canonicalId: string) => {
      if (kind === "spell") {
        update({
          knownSpellCanonicalIds: reference.knownSpellCanonicalIds.filter((x) => x !== canonicalId),
        });
      } else if (kind === "weapon") {
        update({
          weaponCanonicalIds: reference.weaponCanonicalIds.filter((x) => x !== canonicalId),
        });
      } else {
        update({
          magicItemCanonicalIds: reference.magicItemCanonicalIds.filter((x) => x !== canonicalId),
        });
      }
    },
    [reference, update],
  );

  const removePlayer = useCallback(() => {
    userStore.getState().removePlayerReference(reference.id);
  }, [reference.id]);

  const hasSpell =
    reference.knownSpellCanonicalIds.length > 0 ||
    reference.combatValues.spellSaveDc !== undefined ||
    reference.combatValues.spellAttackBonus !== undefined;

  const subclassOptions = reference.class ? (SUBCLASSES[reference.class] ?? []) : [];

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 animate-slide-up">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {editing === "name" ? (
            <InlineTextEditor
              value={draft}
              onChange={setDraft}
              onSave={(value) => commitText("name", value)}
              onCancel={() => setEditing(null)}
              className="text-base font-bold"
            />
          ) : (
            <button
              type="button"
              onClick={() => startEdit("name")}
              className="-mx-1 rounded-md px-1 text-base font-bold text-foreground transition-colors duration-150 hover:bg-accent/50 active:bg-accent/80"
            >
              {reference.name}
            </button>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-2">
            <SelectField
              value={reference.class}
              options={CLASSES}
              onChange={(value) => update({ class: value })}
              ariaLabel="Class"
              placeholder="Class"
            />
            <SelectField
              value={reference.subclass ?? ""}
              options={subclassOptions}
              onChange={(value) => update({ subclass: value || undefined })}
              ariaLabel="Subclass"
              placeholder="Subclass"
              className="max-w-44"
            />
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Lv
              </span>
              <Stepper
                variant="ghost"
                value={reference.level}
                min={1}
                max={20}
                onChange={(value) => update({ level: value })}
                label="Level"
                className="w-28"
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={removePlayer}
          aria-label={`Remove ${reference.name}`}
          className="hitbox-expand inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-card px-3 py-3">
        <div
          className={cn("grid gap-1.5", hasSpell ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-3")}
        >
          <NumberCell
            label="AC"
            value={reference.combatValues.armorClass}
            min={0}
            max={40}
            onChange={(value) => update({ combatValues: { armorClass: value } })}
            valueClassName="text-3xl"
          />
          <NumberCell
            label="Init"
            value={reference.combatValues.initiativeModifier}
            min={-5}
            max={20}
            format={formatSigned}
            onChange={(value) => update({ combatValues: { initiativeModifier: value } })}
            valueClassName="text-3xl"
          />
          <NumberCell
            label="Perc"
            value={reference.combatValues.passivePerception}
            min={0}
            max={40}
            onChange={(value) => update({ combatValues: { passivePerception: value } })}
            valueClassName="text-3xl"
          />
          {hasSpell && (
            <>
              <OptionalNumberCell
                label="DC"
                value={reference.combatValues.spellSaveDc}
                min={0}
                max={40}
                initial={10}
                onCommit={(value) => update({ combatValues: { spellSaveDc: value } })}
                valueClassName="text-3xl"
              />
              <OptionalNumberCell
                label="Atk"
                value={reference.combatValues.spellAttackBonus}
                min={-5}
                max={20}
                format={formatSigned}
                initial={0}
                onCommit={(value) => update({ combatValues: { spellAttackBonus: value } })}
                valueClassName="text-3xl"
              />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        {ABILITY_KEYS.map((key) => (
          <NumberCell
            key={key}
            label={ABILITY_LABELS[key]}
            value={reference.abilityModifiers[key]}
            min={-5}
            max={10}
            format={formatSigned}
            onChange={(value) => update({ abilityModifiers: { [key]: value } })}
            valueClassName="text-lg"
          />
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <ReferenceGroup
          title="Known Spells"
          kind="spell"
          ids={reference.knownSpellCanonicalIds}
          onAdd={() => setPicker("spell")}
          onRemove={(canonicalId) => removeReference("spell", canonicalId)}
        />
        <ReferenceGroup
          title="Weapons"
          kind="weapon"
          ids={reference.weaponCanonicalIds}
          onAdd={() => setPicker("weapon")}
          onRemove={(canonicalId) => removeReference("weapon", canonicalId)}
          getQuickStats={weaponStats}
        />
        <ReferenceGroup
          title="Magic Items"
          kind="magicitem"
          ids={reference.magicItemCanonicalIds}
          onAdd={() => setPicker("magicitem")}
          onRemove={(canonicalId) => removeReference("magicitem", canonicalId)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Quick Note
        </span>
        {editing === "note" ? (
          <InlineTextareaEditor
            value={draft}
            onChange={setDraft}
            onSave={(value) => commitText("note", value)}
            onCancel={() => setEditing(null)}
            rows={2}
            placeholder="One quick reminder…"
          />
        ) : reference.note ? (
          <button
            type="button"
            onClick={() => startEdit("note")}
            className="rounded-md text-left text-sm text-foreground transition-colors duration-150 hover:bg-accent/50"
          >
            {reference.note}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => startEdit("note")}
            className="rounded-md text-left text-xs text-muted-foreground transition-colors duration-150 hover:bg-accent/50"
          >
            Add a quick note…
          </button>
        )}
      </div>

      {picker && (
        <ReferencePicker
          title={PICKER_TITLES[picker]}
          candidates={candidates}
          onSelect={(canonicalId) => addReference(picker, canonicalId)}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

export function PartyPage() {
  const players = usePlayerReferences();
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const handleAdd = useCallback(() => {
    const id = userStore.getState().addPlayerReference(createEmptyReference());
    setCreatingId(id);
  }, []);

  return (
    <div className="flex flex-col px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Party</h1>
          <p className="text-xs text-muted-foreground">
            {players.length === 0
              ? "The values you consult every session"
              : `${players.length} reference${players.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button onClick={handleAdd}>Add Player</Button>
      </div>

      {players.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-2 py-10 text-center">
          <p className="max-w-xs text-sm text-muted-foreground">
            Quick-access references: combat numbers, ability modifiers, and links to the spells,
            weapons, and magic items you use most. Nothing else — no inventory, no tracking.
          </p>
          <Button onClick={handleAdd}>Create your first reference</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {players.map((player) => (
            <PlayerReferenceCard
              key={player.id}
              reference={player}
              autoEditName={player.id === creatingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
