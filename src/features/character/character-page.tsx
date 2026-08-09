import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCharacters, userStore } from "@/user-state";
import type { CharacterReference, CharacterReferenceUpdate } from "@/user-state";
import {
  extractSpellRoll,
  formatDamage,
  getEntitiesForCategory,
  SCHOOL_NAMES,
  resolveEntity,
  METADATA_SEPARATOR,
} from "@/compendium";
import type { ContentBlock, Equipment, MagicItem, Spell } from "@/compendium";
import { entityRefFromCanonicalId } from "@/components/entity";
import { CloseIcon } from "@/components/ui/icons";
import { ReferencePicker } from "@/components/ui/ReferencePicker";
import type { PickerCandidate } from "@/components/ui/ReferencePicker";
import { InlineTextEditor } from "@/components/ui/InlineTextEditor";
import { InlineTextareaEditor } from "@/components/ui/InlineTextareaEditor";
import {
  Button,
  ConfirmDialog,
  EmptyState,
  HelpTip,
  InfoPopover,
  SelectField,
  Stepper,
  useLongPressInfo,
} from "@/components/ui";
import { AbilityScores } from "@/components/ui/ability-scores";
import { RollableDice } from "@/features/dice/rollable-dice";
import { splitSpellRoll } from "@/lib/dice";
import { cn } from "@/lib/utils";

type PickerKind = "spell" | "weapon" | "magicitem";

const PICKER_TITLES: Record<PickerKind, string> = {
  spell: "Spells",
  weapon: "Weapons",
  magicitem: "Magic Items",
};

const WEAPON_TYPES = new Set(["Melee Weapon", "Ranged Weapon"]);

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

function classLine(reference: CharacterReference): string {
  if (!reference.class) return "Add class, subclass, and level";
  const cls = reference.subclass ? `${reference.class} (${reference.subclass})` : reference.class;
  return `${cls} · Lv ${reference.level}`;
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
    <div className="flex flex-col gap-2 rounded-card bg-card px-3 py-2 animate-slide-up">
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
  const roll = extractSpellRoll(spell.description);
  const spellRoll = roll ? splitSpellRoll(roll) : null;
  const summary = firstParagraphText(spell.description);
  const flags = [spell.concentration && "Concentration", spell.ritual && "Ritual"].filter(
    Boolean,
  ) as string[];
  const details = [spell.castingTime, spell.range, spell.duration].filter(Boolean);
  return (
    <div className="flex flex-col gap-2 rounded-card bg-card px-3 py-2 animate-slide-up">
      <p className="text-xs font-semibold text-foreground">
        {levelText} {METADATA_SEPARATOR} {school}
      </p>
      {spellRoll && (
        <RollableDice
          expression={spellRoll.expression}
          label={spellRoll.type}
          className="text-base font-bold tabular-nums text-foreground"
        />
      )}
      {details.length > 0 && (
        <p className="text-xs text-foreground-subtle">{details.join(` ${METADATA_SEPARATOR} `)}</p>
      )}
      {flags.length > 0 && (
        <div className="flex items-center gap-1">
          {flags.map((flag) => (
            <span
              key={flag}
              className="rounded-control border border-border bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground"
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

function createEmptyCharacter(): Omit<CharacterReference, "id"> {
  return {
    name: "New Character",
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
    activeConditions: [],
    note: undefined,
  };
}

function StatCard({
  label,
  value,
  min,
  max,
  onChange,
  onClear,
  help,
  valueClassName = "font-mono text-2xl",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onClear?: () => void;
  help?: string;
  valueClassName?: string;
}) {
  const { open, placement, shiftX, containerRef, popoverRef, startPress, clearTimer } =
    useLongPressInfo<HTMLDivElement>();

  return (
    <div
      ref={containerRef}
      onPointerDown={startPress}
      onPointerUp={clearTimer}
      onPointerLeave={clearTimer}
      onPointerCancel={clearTimer}
      className="relative flex min-w-0 flex-col items-center gap-1 rounded-stat border border-border-amber bg-card readout-card px-1 py-2"
    >
      <span className="flex w-full items-center justify-between gap-0.5">
        <span className="min-w-0 text-[11px] font-semibold uppercase tracking-tight text-muted-foreground">
          {label}
        </span>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label={`Clear ${label}`}
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-control text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground active:scale-90"
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
      </span>
      <Stepper
        variant="ghost"
        hiddenControls
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        label={label}
        className="h-9"
        valueClassName={valueClassName}
      />
      {open && help && (
        <InfoPopover placement={placement} shiftX={shiftX} popoverRef={popoverRef} title={label}>
          {help}
        </InfoPopover>
      )}
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

function ReferenceCell({
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

  const remove = (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove(canonicalId);
      }}
      aria-label={`Remove ${ref.name}`}
      className="hitbox-expand absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-control text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
    >
      <CloseIcon />
    </button>
  );

  const content = (
    <>
      <span className="flex w-full min-w-0 flex-col items-center gap-0.5 text-center">
        <span className="min-w-0 max-w-full truncate text-xs font-bold text-foreground">
          {ref.name}
        </span>
        {subtitle && (
          <span className="min-w-0 max-w-full truncate text-[10px] text-foreground-subtle">
            {subtitle}
          </span>
        )}
      </span>
      {quickStats && (
        <span className="shrink-0 rounded-stat bg-card px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-foreground">
          {quickStats}
        </span>
      )}
    </>
  );

  const base =
    "flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-card border border-border-amber bg-surface readout-card p-1.5 pr-2.5 transition-all duration-150 hover:bg-accent/50 active:bg-accent/80 animate-fade-in";

  if (previewable) {
    return (
      <div className="relative flex flex-col animate-fade-in">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={cn(base, expanded && "bg-accent/40")}
        >
          {content}
        </button>
        {remove}
        {expanded && selected?.category === "spell" && (
          <SpellPreview spell={selected} href={ref.href} />
        )}
        {expanded && selected?.category === "equipment" && (
          <WeaponPreview item={selected} href={ref.href} />
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col animate-fade-in">
      <Link to={ref.href} className={base}>
        {content}
      </Link>
      {remove}
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {title}
          <HelpTip label={`More about ${title}`}>{help}</HelpTip>
        </span>
        <AddButton label="Add" onClick={onAdd} />
      </div>
      {ids.length === 0 ? (
        <p className="px-1 text-xs text-foreground-subtle">None</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {ids.map((canonicalId) => (
            <ReferenceCell
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
    <span className="border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

function CharacterSheet({
  reference,
  autoEditName,
}: {
  reference: CharacterReference;
  autoEditName: boolean;
}) {
  const [editing, setEditing] = useState<"name" | "note" | null>(autoEditName ? "name" : null);
  const [draft, setDraft] = useState("");
  const [subtitleEditing, setSubtitleEditing] = useState(false);
  const [picker, setPicker] = useState<PickerKind | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const candidates = useMemo(() => (picker ? buildCandidates(picker) : []), [picker]);

  const update = useCallback(
    (data: CharacterReferenceUpdate) => {
      userStore.getState().updateCharacter(reference.id, data);
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

  const removeCharacter = useCallback(() => {
    userStore.getState().removeCharacter(reference.id);
  }, [reference.id]);

  const subclassOptions = reference.class ? (SUBCLASSES[reference.class] ?? []) : [];

  return (
    <div className="flex flex-col gap-4 rounded-card border border-border bg-surface p-3 animate-slide-up">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {editing === "name" ? (
            <InlineTextEditor
              value={draft}
              onChange={setDraft}
              onSave={(value) => commitText("name", value)}
              onCancel={() => setEditing(null)}
              ariaLabel="Name"
              className="text-base font-bold"
            />
          ) : (
            <button
              type="button"
              onClick={() => startEdit("name")}
              className="-mx-1 rounded-control px-1 text-lg font-bold text-foreground transition-colors duration-150 hover:bg-accent/50 active:bg-accent/80"
            >
              {reference.name}
            </button>
          )}
          {subtitleEditing ? (
            <div className="mt-2 flex flex-col gap-2 rounded-card border border-border bg-card p-3">
              <div className="flex flex-wrap gap-2">
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
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Level
                </span>
                <div className="flex items-center gap-2">
                  <Stepper
                    value={reference.level}
                    min={1}
                    max={20}
                    onChange={(value) => update({ level: value })}
                    label="Level"
                  />
                  <Button variant="ghost" size="sm" onClick={() => setSubtitleEditing(false)}>
                    Done
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSubtitleEditing(true)}
              aria-label="Edit class, subclass, and level"
              className="block w-fit -mx-1 mt-1 rounded-control px-1 text-xs font-medium text-foreground-subtle transition-colors duration-150 hover:bg-accent/50 hover:text-foreground"
            >
              {classLine(reference)}
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setConfirmRemove(true)}
            title={`Remove ${reference.name}`}
            aria-label={`Remove ${reference.name}`}
            className="hitbox-expand relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-control text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-90 active:bg-accent/80"
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
        <span className="flex items-center gap-1 border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Combat
          <HelpTip label="What are combat stats?">
            The numbers you check every fight. Armor Class is what enemies must beat to hit you.
            Passive Perception notices hidden things.
          </HelpTip>
        </span>
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            label="AC"
            value={reference.combatValues.armorClass}
            min={0}
            max={40}
            onChange={(value) => update({ combatValues: { armorClass: value } })}
            help="Armor Class is what enemies must beat to hit you."
          />
          <StatCard
            label="Perception"
            value={reference.combatValues.passivePerception}
            min={0}
            max={40}
            onChange={(value) => update({ combatValues: { passivePerception: value } })}
            help="Passive Perception is how well you notice hidden things without trying."
          />
          <StatCard
            label="DC"
            value={reference.combatValues.spellSaveDc ?? 10}
            min={0}
            max={40}
            onChange={(value) => update({ combatValues: { spellSaveDc: value } })}
            help="Spell save DC is the number enemies must beat to resist your spells."
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-1 border-l-2 border-primary pl-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Abilities
          <HelpTip label="What are ability scores?">
            Six scores describe your character's strengths. The modifier underneath is the bonus you
            add to rolls — higher scores mean bigger bonuses.
          </HelpTip>
        </span>
        <AbilityScores
          scores={reference.abilityScores}
          onChange={(key, value) => update({ abilityScores: { [key]: value } })}
          columns={3}
        />
      </div>

      <div className="flex flex-col gap-4">
        <ReferenceGroup
          title="Spells"
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

      <div className="flex flex-col gap-2">
        <SectionLabel>Notes</SectionLabel>
        {editing === "note" ? (
          <InlineTextareaEditor
            value={draft}
            onChange={setDraft}
            onSave={(value) => commitText("note", value)}
            onCancel={() => setEditing(null)}
            rows={2}
            placeholder="One quick reminder…"
            ariaLabel="Quick note"
          />
        ) : reference.note ? (
          <button
            type="button"
            onClick={() => startEdit("note")}
            className="rounded-control text-left text-sm text-foreground transition-colors duration-150 hover:bg-accent/50"
          >
            {reference.note}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => startEdit("note")}
            className="rounded-control text-left text-xs text-muted-foreground transition-colors duration-150 hover:bg-accent/50"
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
            removeCharacter();
          }}
        />
      )}
    </div>
  );
}

export function CharacterPage() {
  const characters = useCharacters();
  const activeCharacterId = userStore((s) => s.activeCharacterId);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const activeCharacter = useMemo(() => {
    if (!activeCharacterId) return characters[0] ?? null;
    return characters.find((c) => c.id === activeCharacterId) ?? characters[0] ?? null;
  }, [characters, activeCharacterId]);

  const handleAdd = useCallback(() => {
    const id = userStore.getState().addCharacter(createEmptyCharacter());
    setCreatingId(id);
  }, []);

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {characters.length === 0 ? (
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
          action={<Button onClick={handleAdd}>Create your first character</Button>}
        />
      ) : (
        <>
          {characters.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {characters.map((character) => (
                <button
                  key={character.id}
                  type="button"
                  onClick={() => userStore.getState().setActiveCharacter(character.id)}
                  aria-pressed={character.id === activeCharacterId}
                  className={cn(
                    "rounded-control border border-border px-3 py-1 text-xs font-medium transition-all duration-150 active:scale-95",
                    character.id === activeCharacterId
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {character.name}
                </button>
              ))}
              <Button variant="ghost" size="sm" onClick={handleAdd}>
                + Add
              </Button>
            </div>
          )}
          {activeCharacter && (
            <CharacterSheet
              key={activeCharacter.id}
              reference={activeCharacter}
              autoEditName={activeCharacter.id === creatingId}
            />
          )}
        </>
      )}
    </div>
  );
}
