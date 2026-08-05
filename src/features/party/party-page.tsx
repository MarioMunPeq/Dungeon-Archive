import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePlayerReferences, userStore, abilityModifier } from "@/user-state";
import type { PlayerReference, PlayerReferenceUpdate } from "@/user-state";
import {
  formatDamage,
  getEntitiesForCategory,
  SCHOOL_NAMES,
  resolveEntity,
  METADATA_SEPARATOR,
} from "@/compendium";
import type { ContentBlock, Equipment, MagicItem, Spell } from "@/compendium";
import { entityRefFromCanonicalId, EntityReferenceRow, RowRemoveButton } from "@/components/entity";
import { ReferencePicker } from "@/components/ui/ReferencePicker";
import type { PickerCandidate } from "@/components/ui/ReferencePicker";
import { InlineTextEditor } from "@/components/ui/InlineTextEditor";
import { InlineTextareaEditor } from "@/components/ui/InlineTextareaEditor";
import { Button, ConfirmDialog, EmptyState, HelpTip, SelectField, Stepper } from "@/components/ui";
import { cn } from "@/lib/utils";

type PickerKind = "spell" | "weapon" | "magicitem";

const PICKER_TITLES: Record<PickerKind, string> = {
  spell: "Known Spells",
  weapon: "Weapons",
  magicitem: "Magic Items",
};

const WEAPON_TYPES = new Set(["Melee Weapon", "Ranged Weapon"]);

type AbilityKey = keyof PlayerReference["abilityScores"];

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

const ABILITY_HELP: Record<AbilityKey, string> = {
  strength: "Physical power. Used for lifting, pushing, and melee attacks.",
  dexterity: "Agility and reflexes. Used for sneaking, dodging, and finesse attacks.",
  constitution: "Toughness and stamina. Raises your hit points.",
  intelligence: "Reasoning and memory. Used by wizards and for knowledge checks.",
  wisdom: "Awareness and intuition. Used by clerics and for perception.",
  charisma: "Force of personality. Used for persuasion, performance, and deception.",
};

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
          subtitle: `${s.level === 0 ? "Cantrip" : `Level ${s.level}`} ${METADATA_SEPARATOR} ${SCHOOL_NAMES[s.school] ?? s.school}`,
        });
      }
      break;
    }
    case "weapon": {
      for (const e of getEntitiesForCategory("equipment") as readonly Equipment[]) {
        if (!WEAPON_TYPES.has(e.type)) continue;
        const dmg = formatDamage(e.damage, e.damageType);
        push({
          canonicalId: e.canonicalId,
          name: e.name,
          subtitle: dmg ? `${e.type} ${METADATA_SEPARATOR} ${dmg}` : e.type,
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
  return value >= 0 ? `+${value}` : `${value}`;
}

function weaponStats(canonicalId: string): string | undefined {
  const resolved = resolveEntity(canonicalId);
  if (!resolved || resolved.selected.category !== "equipment") return undefined;
  const item = resolved.selected as Equipment;
  return formatDamage(item.damage, item.damageType) || undefined;
}

function spellSubtitle(entity: Spell | undefined): string | undefined {
  if (!entity) return undefined;
  const levelText = entity.level === 0 ? "Cantrip" : `Level ${entity.level}`;
  return `${levelText} ${METADATA_SEPARATOR} ${SCHOOL_NAMES[entity.school] ?? entity.school}`;
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
  const damage = formatDamage(item.damage, item.damageType);
  const properties = item.properties ?? [];
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-card px-3 py-2 animate-slide-up">
      {damage && <p className="text-base font-bold tabular-nums text-foreground">{damage}</p>}
      {properties.length > 0 && (
        <p className="text-xs text-foreground-subtle">
          {properties.join(` ${METADATA_SEPARATOR} `)}
        </p>
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
  const details = [spell.castingTime, spell.range, spell.duration].filter(Boolean);
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-card px-3 py-2 animate-slide-up">
      <p className="text-xs font-semibold text-foreground">
        {levelText} {METADATA_SEPARATOR} {school}
      </p>
      {details.length > 0 && (
        <p className="text-xs text-foreground-subtle">{details.join(` ${METADATA_SEPARATOR} `)}</p>
      )}
      {flags.length > 0 && (
        <div className="flex items-center gap-1">
          {flags.map((flag) => (
            <span
              key={flag}
              className="rounded-full border border-border bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground"
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
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    hitPoints: { current: 10, max: 10 },
    combatValues: { armorClass: 10, initiativeModifier: 0, passivePerception: 10 },
    knownSpellCanonicalIds: [],
    weaponCanonicalIds: [],
    magicItemCanonicalIds: [],
    note: undefined,
  };
}

function StatCard({
  label,
  value,
  min,
  max,
  format,
  onChange,
  onClear,
  help,
  valueClassName = "text-3xl",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  format?: (value: number) => string;
  onChange: (value: number) => void;
  onClear?: () => void;
  help?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1 rounded-lg border border-border bg-card px-2 py-3">
      <span className="flex w-full items-center justify-between gap-1">
        <span className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="flex items-center gap-1">
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label={`Clear ${label}`}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground active:scale-90"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-3 w-3"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          {help && <HelpTip label={`More about ${label}`}>{help}</HelpTip>}
        </span>
      </span>
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

function AbilityScoreCell({
  key_,
  score,
  onChange,
}: {
  key_: AbilityKey;
  score: number;
  onChange: (value: number) => void;
}) {
  const modifier = abilityModifier(score);
  return (
    <div className="flex min-w-0 flex-col items-center gap-1 rounded-lg border border-border bg-card px-2 py-3">
      <span className="flex w-full items-center justify-between gap-1">
        <span className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {ABILITY_LABELS[key_]}
        </span>
        <HelpTip label={`What is ${ABILITY_LABELS[key_]}?`}>{ABILITY_HELP[key_]}</HelpTip>
      </span>
      <Stepper
        variant="ghost"
        hiddenControls
        value={score}
        min={1}
        max={30}
        onChange={onChange}
        label={ABILITY_LABELS[key_]}
        valueClassName="text-2xl"
      />
      <span
        className={cn(
          "rounded-md px-2 py-0.5 text-xs font-bold tabular-nums",
          modifier >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
        )}
      >
        {formatSigned(modifier)}
      </span>
    </div>
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
        className="h-4 w-4"
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
        className="py-2"
        trailing={
          quickStats ? (
            <span className="shrink-0 rounded-md bg-card px-2 py-1 text-xs font-semibold tabular-nums text-foreground">
              {quickStats}
            </span>
          ) : undefined
        }
        action={<RowRemoveButton label={`Remove ${ref.name}`} onClick={handleRemove} />}
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
  help,
  kind,
  ids,
  onAdd,
  onRemove,
  getQuickStats,
}: {
  title: string;
  help: string;
  kind: PickerKind;
  ids: string[];
  onAdd: () => void;
  onRemove: (canonicalId: string) => void;
  getQuickStats?: (canonicalId: string) => string | undefined;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
          <HelpTip label={`More about ${title}`}>{help}</HelpTip>
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

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

function PlayerReferenceCard({
  reference,
  autoEditName,
  current,
}: {
  reference: PlayerReference;
  autoEditName: boolean;
  current: boolean;
}) {
  const [editing, setEditing] = useState<"name" | "note" | null>(autoEditName ? "name" : null);
  const [draft, setDraft] = useState("");
  const [picker, setPicker] = useState<PickerKind | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

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
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-3 animate-slide-up">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {editing === "name" ? (
            <InlineTextEditor
              value={draft}
              onChange={setDraft}
              onSave={(value) => commitText("name", value)}
              onCancel={() => setEditing(null)}
              aria-label="Name"
              className="text-base font-bold"
            />
          ) : (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
              <button
                type="button"
                onClick={() => startEdit("name")}
                className="-mx-1 rounded-lg px-1 text-base font-bold text-foreground transition-colors duration-150 hover:bg-accent/50 active:bg-accent/80"
              >
                {reference.name}
              </button>
              {current && (
                <span className="rounded-full border border-border bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Current
                </span>
              )}
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-2">
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
            />
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Lv
              </span>
              <Stepper
                variant="ghost"
                hiddenControls
                value={reference.level}
                min={1}
                max={20}
                onChange={(value) => update({ level: value })}
                label="Level"
                className="w-20"
              />
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => userStore.getState().setActivePlayer(current ? null : reference.id)}
            title={
              current ? `Clear ${reference.name} as current` : `Set ${reference.name} as current`
            }
            aria-pressed={current}
            className={cn(
              "hitbox-expand inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150 active:scale-90",
              current
                ? "text-primary hover:bg-primary/10"
                : "text-muted-foreground hover:bg-accent hover:text-foreground active:bg-accent/80",
            )}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setConfirmRemove(true)}
            title={`Remove ${reference.name}`}
            aria-label={`Remove ${reference.name}`}
            className="hitbox-expand inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
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
      </div>

      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Combat Stats
          <HelpTip label="What are combat stats?">
            The numbers you check every fight. Armor Class is what enemies must beat to hit you.
            Initiative decides turn order. Passive Perception notices hidden things.
          </HelpTip>
        </span>
        <div className={cn("grid gap-2", hasSpell ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-3")}>
          <StatCard
            label="AC"
            value={reference.combatValues.armorClass}
            min={0}
            max={40}
            onChange={(value) => update({ combatValues: { armorClass: value } })}
          />
          <StatCard
            label="Init"
            value={reference.combatValues.initiativeModifier}
            min={-5}
            max={20}
            format={formatSigned}
            onChange={(value) => update({ combatValues: { initiativeModifier: value } })}
          />
          <StatCard
            label="Passive Perc."
            value={reference.combatValues.passivePerception}
            min={0}
            max={40}
            onChange={(value) => update({ combatValues: { passivePerception: value } })}
          />
          {hasSpell && (
            <>
              <StatCard
                label="DC"
                value={reference.combatValues.spellSaveDc ?? 10}
                min={0}
                max={40}
                onChange={(value) => update({ combatValues: { spellSaveDc: value } })}
                help="Spell save DC is the number enemies must beat to resist your spells."
              />
              <StatCard
                label="Atk"
                value={reference.combatValues.spellAttackBonus ?? 0}
                min={-5}
                max={20}
                format={formatSigned}
                onChange={(value) => update({ combatValues: { spellAttackBonus: value } })}
                help="Your spell attack bonus is added to a d20 when a spell attacks an enemy directly."
              />
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Ability Scores
          <HelpTip label="What are ability scores?">
            Six scores describe your character's strengths. The modifier underneath is the bonus you
            add to rolls — higher scores mean bigger bonuses.
          </HelpTip>
        </span>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ABILITY_KEYS.map((key) => (
            <AbilityScoreCell
              key={key}
              key_={key}
              score={reference.abilityScores[key]}
              onChange={(value) => update({ abilityScores: { [key]: value } })}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <ReferenceGroup
          title="Known Spells"
          help="Spells your character can cast. Add the ones you use most for quick access."
          kind="spell"
          ids={reference.knownSpellCanonicalIds}
          onAdd={() => setPicker("spell")}
          onRemove={(canonicalId) => removeReference("spell", canonicalId)}
        />
        <ReferenceGroup
          title="Weapons"
          help="The weapons your character carries, with their damage at a glance."
          kind="weapon"
          ids={reference.weaponCanonicalIds}
          onAdd={() => setPicker("weapon")}
          onRemove={(canonicalId) => removeReference("weapon", canonicalId)}
          getQuickStats={weaponStats}
        />
        <ReferenceGroup
          title="Magic Items"
          help="Magic items your character owns. Add the ones you consult during play."
          kind="magicitem"
          ids={reference.magicItemCanonicalIds}
          onAdd={() => setPicker("magicitem")}
          onRemove={(canonicalId) => removeReference("magicitem", canonicalId)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <SectionLabel>Quick Note</SectionLabel>
        {editing === "note" ? (
          <InlineTextareaEditor
            value={draft}
            onChange={setDraft}
            onSave={(value) => commitText("note", value)}
            onCancel={() => setEditing(null)}
            rows={2}
            placeholder="One quick reminder…"
            aria-label="Quick note"
          />
        ) : reference.note ? (
          <button
            type="button"
            onClick={() => startEdit("note")}
            className="rounded-lg text-left text-sm text-foreground transition-colors duration-150 hover:bg-accent/50"
          >
            {reference.note}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => startEdit("note")}
            className="rounded-lg text-left text-xs text-muted-foreground transition-colors duration-150 hover:bg-accent/50"
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

      {confirmRemove && (
        <ConfirmDialog
          title={`Remove ${reference.name}?`}
          message="This removes their combat numbers, ability scores, and references. This can't be undone."
          confirmLabel="Remove"
          destructive
          onCancel={() => setConfirmRemove(false)}
          onConfirm={() => {
            setConfirmRemove(false);
            removePlayer();
          }}
        />
      )}
    </div>
  );
}

export function PartyPage() {
  const players = usePlayerReferences();
  const activePlayerId = userStore((s) => s.activePlayerId);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const activePlayer = useMemo(() => {
    if (!activePlayerId) return players[0] ?? null;
    return players.find((p) => p.id === activePlayerId) ?? players[0] ?? null;
  }, [players, activePlayerId]);

  const handleAdd = useCallback(() => {
    const id = userStore.getState().addPlayerReference(createEmptyReference());
    setCreatingId(id);
  }, []);

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {players.length === 0 ? (
        <EmptyState
          title="No character yet"
          description="Add your character to start tracking ability scores, combat stats, and the spells and items you use most."
          icon={
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          action={
            <Button onClick={handleAdd}>Create your first character</Button>
          }
        />
      ) : (
        <>
          {players.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {players.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => userStore.getState().setActivePlayer(player.id)}
                  aria-pressed={player.id === activePlayerId}
                  className={cn(
                    "rounded-full border border-border px-3 py-1 text-xs font-medium transition-all duration-150 active:scale-95",
                    player.id === activePlayerId
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {player.name}
                </button>
              ))}
              <Button variant="ghost" size="sm" onClick={handleAdd}>
                + Add
              </Button>
            </div>
          )}
          {activePlayer && (
            <PlayerReferenceCard
              key={activePlayer.id}
              reference={activePlayer}
              autoEditName={activePlayer.id === creatingId}
              current={activePlayer.id === activePlayerId}
            />
          )}
        </>
      )}
    </div>
  );
}
