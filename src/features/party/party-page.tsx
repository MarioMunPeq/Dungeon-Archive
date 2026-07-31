import { useState, useCallback, useMemo, type FormEvent, type ReactNode } from "react";
import { usePartyMembers, userStore } from "@/user-state";
import type { PartyMember } from "@/user-state";
import { getEntity, getEntitiesForCategory, slugFromCanonicalId, SCHOOL_NAMES } from "@/compendium";
import type { Equipment, Spell, MagicItem } from "@/compendium";
import { entityRefFromCanonicalId, EntityReferenceRow, RowRemoveButton } from "@/components/entity";
import { ReferencePicker } from "@/components/ui/ReferencePicker";
import type { PickerCandidate } from "@/components/ui/ReferencePicker";

type PickerKind = "spell" | "armor" | "weapon" | "magicitem";

const PICKER_TITLES: Record<PickerKind, string> = {
  spell: "Known Spells",
  armor: "Armor",
  weapon: "Weapons",
  magicitem: "Magic Items",
};

const ARMOR_TYPES = new Set(["Light Armor", "Medium Armor", "Heavy Armor", "Shield"]);
const WEAPON_TYPES = new Set(["Melee Weapon", "Ranged Weapon"]);

const CLASS_OPTIONS = [
  "Artificer",
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
];

const RACE_OPTIONS = [
  "Aarakocra",
  "Aasimar",
  "Bugbear",
  "Centaur",
  "Dragonborn",
  "Dwarf",
  "Elf",
  "Firbolg",
  "Genasi",
  "Gnome",
  "Goblin",
  "Goliath",
  "Half-Elf",
  "Half-Orc",
  "Halfling",
  "Human",
  "Kenku",
  "Kobold",
  "Lizardfolk",
  "Minotaur",
  "Orc",
  "Tabaxi",
  "Tiefling",
  "Tortle",
  "Triton",
  "Warforged",
];

interface MemberDraft {
  name: string;
  class: string;
  level: string;
  race: string;
  subclass: string;
  passivePerception: string;
  passiveInsight: string;
  passiveInvestigation: string;
  notes: string;
  knownSpellCanonicalIds: string[];
  equippedArmorCanonicalId?: string;
  equippedWeaponCanonicalIds: string[];
  equippedMagicItemCanonicalIds: string[];
}

const EMPTY_DRAFT: MemberDraft = {
  name: "",
  class: "",
  level: "1",
  race: "",
  subclass: "",
  passivePerception: "",
  passiveInsight: "",
  passiveInvestigation: "",
  notes: "",
  knownSpellCanonicalIds: [],
  equippedArmorCanonicalId: undefined,
  equippedWeaponCanonicalIds: [],
  equippedMagicItemCanonicalIds: [],
};

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

function armorLabel(armorId: string | undefined): string | null {
  if (!armorId || !armorId.startsWith("equipment.")) return null;
  const item = getEntity("equipment", slugFromCanonicalId(armorId)) as Equipment | undefined;
  if (!item) return null;
  return item.ac !== undefined ? `${item.type} \u00B7 AC ${item.ac}` : item.type;
}

function buildCandidates(kind: PickerKind): PickerCandidate[] {
  switch (kind) {
    case "spell": {
      const spells = getEntitiesForCategory("spell") as readonly Spell[];
      return spells.map((s) => ({
        canonicalId: s.canonicalId,
        name: s.name,
        subtitle: `${s.level === 0 ? "Cantrip" : `Level ${s.level}`} \u00B7 ${SCHOOL_NAMES[s.school] ?? s.school}`,
      }));
    }
    case "armor": {
      const items = getEntitiesForCategory("equipment") as readonly Equipment[];
      return items
        .filter((e) => ARMOR_TYPES.has(e.type))
        .map((e) => ({
          canonicalId: e.canonicalId,
          name: e.name,
          subtitle: `${e.type} \u00B7 AC ${e.ac ?? ""}`,
        }));
    }
    case "weapon": {
      const items = getEntitiesForCategory("equipment") as readonly Equipment[];
      return items
        .filter((e) => WEAPON_TYPES.has(e.type))
        .map((e) => {
          const dmg = [e.damage, e.damageType].filter(Boolean).join(" ");
          return { canonicalId: e.canonicalId, name: e.name, subtitle: dmg ? `${e.type} \u00B7 ${dmg}` : e.type };
        });
    }
    case "magicitem": {
      const items = getEntitiesForCategory("magicitem") as readonly MagicItem[];
      return items.map((m) => ({
        canonicalId: m.canonicalId,
        name: m.name,
        subtitle: m.rarity,
      }));
    }
  }
}

function draftFromMember(m: PartyMember): MemberDraft {
  return {
    name: m.name,
    class: m.class,
    level: String(m.level),
    race: m.race ?? "",
    subclass: m.subclass ?? "",
    passivePerception: m.passivePerception !== undefined ? String(m.passivePerception) : "",
    passiveInsight: m.passiveInsight !== undefined ? String(m.passiveInsight) : "",
    passiveInvestigation: m.passiveInvestigation !== undefined ? String(m.passiveInvestigation) : "",
    notes: m.notes ?? "",
    knownSpellCanonicalIds: [...m.knownSpellCanonicalIds],
    equippedArmorCanonicalId: m.equippedArmorCanonicalId,
    equippedWeaponCanonicalIds: [...m.equippedWeaponCanonicalIds],
    equippedMagicItemCanonicalIds: [...m.equippedMagicItemCanonicalIds],
  };
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-sm font-semibold text-foreground">{children}</h2>;
}

function RefRow({ canonicalId, onRemove }: { canonicalId: string; onRemove: (id: string) => void }) {
  const ref = entityRefFromCanonicalId(canonicalId);
  if (!ref) return null;
  return (
    <EntityReferenceRow
      canonicalId={canonicalId}
      subtitle={ref.subtitle}
      showBadge={false}
      asLink={false}
      className="border-b border-border py-2"
      action={<RowRemoveButton label={`Remove ${ref.name}`} onClick={() => onRemove(canonicalId)} />}
    />
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="touch-target flex items-center justify-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground transition-all duration-150 hover:bg-accent active:bg-accent/80 active:scale-95"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      {label}
    </button>
  );
}

function memberChips(member: PartyMember): string[] {
  const chips: string[] = [];
  const armor = armorLabel(member.equippedArmorCanonicalId);
  if (armor) chips.push(armor);
  if (member.knownSpellCanonicalIds.length > 0) {
    chips.push(`${member.knownSpellCanonicalIds.length} spell${member.knownSpellCanonicalIds.length === 1 ? "" : "s"}`);
  }
  if (member.equippedWeaponCanonicalIds.length > 0) {
    chips.push(`${member.equippedWeaponCanonicalIds.length} weapon${member.equippedWeaponCanonicalIds.length === 1 ? "" : "s"}`);
  }
  if (member.equippedMagicItemCanonicalIds.length > 0) {
    chips.push(`${member.equippedMagicItemCanonicalIds.length} magic item${member.equippedMagicItemCanonicalIds.length === 1 ? "" : "s"}`);
  }
  return chips;
}

export function PartyPage() {
  const party = usePartyMembers();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<MemberDraft>(EMPTY_DRAFT);
  const [picker, setPicker] = useState<PickerKind | null>(null);

  const candidates = useMemo(() => (picker ? buildCandidates(picker) : []), [picker]);
  const editingMember = editingId ? party.find((m) => m.id === editingId) : undefined;
  const canSave = draft.name.trim().length > 0 && draft.class.trim().length > 0;

  const handleStartCreate = useCallback(() => {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }, []);

  const handleEdit = useCallback((member: PartyMember) => {
    setEditingId(member.id);
    setDraft(draftFromMember(member));
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }, []);

  const handleDelete = useCallback(() => {
    if (!editingId) return;
    userStore.getState().removePartyMember(editingId);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }, [editingId]);

  const handleSave = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!canSave) return;
      const parsePassive = (s: string): number | undefined => {
        const t = s.trim();
        if (t === "") return undefined;
        const n = Math.floor(Number(t));
        return Number.isFinite(n) ? Math.max(0, n) : undefined;
      };
      const data: Omit<PartyMember, "id"> = {
        name: draft.name.trim(),
        class: draft.class.trim(),
        level: Math.max(1, Math.min(20, Math.floor(Number(draft.level) || 1))),
        race: draft.race.trim() || undefined,
        subclass: draft.subclass.trim() || undefined,
        passivePerception: parsePassive(draft.passivePerception),
        passiveInsight: parsePassive(draft.passiveInsight),
        passiveInvestigation: parsePassive(draft.passiveInvestigation),
        notes: draft.notes.trim() || undefined,
        knownSpellCanonicalIds: [...draft.knownSpellCanonicalIds],
        equippedArmorCanonicalId: draft.equippedArmorCanonicalId,
        equippedWeaponCanonicalIds: [...draft.equippedWeaponCanonicalIds],
        equippedMagicItemCanonicalIds: [...draft.equippedMagicItemCanonicalIds],
      };
      if (editingId) {
        userStore.getState().updatePartyMember(editingId, data);
      } else {
        userStore.getState().addPartyMember(data);
      }
      setEditingId(null);
      setDraft(EMPTY_DRAFT);
    },
    [draft, editingId, canSave],
  );

  const handlePickerSelect = useCallback(
    (canonicalId: string) => {
      if (!picker) return;
      setDraft((d) => {
        switch (picker) {
          case "spell":
            if (d.knownSpellCanonicalIds.includes(canonicalId)) return d;
            return { ...d, knownSpellCanonicalIds: [...d.knownSpellCanonicalIds, canonicalId] };
          case "armor":
            return { ...d, equippedArmorCanonicalId: canonicalId };
          case "weapon":
            if (d.equippedWeaponCanonicalIds.includes(canonicalId)) return d;
            return { ...d, equippedWeaponCanonicalIds: [...d.equippedWeaponCanonicalIds, canonicalId] };
          case "magicitem":
            if (d.equippedMagicItemCanonicalIds.includes(canonicalId)) return d;
            return { ...d, equippedMagicItemCanonicalIds: [...d.equippedMagicItemCanonicalIds, canonicalId] };
        }
      });
      setPicker(null);
    },
    [picker],
  );

  const handleRemoveSpell = useCallback((id: string) => {
    setDraft((d) => ({ ...d, knownSpellCanonicalIds: d.knownSpellCanonicalIds.filter((x) => x !== id) }));
  }, []);

  const handleRemoveWeapon = useCallback((id: string) => {
    setDraft((d) => ({ ...d, equippedWeaponCanonicalIds: d.equippedWeaponCanonicalIds.filter((x) => x !== id) }));
  }, []);

  const handleRemoveMagicItem = useCallback((id: string) => {
    setDraft((d) => ({ ...d, equippedMagicItemCanonicalIds: d.equippedMagicItemCanonicalIds.filter((x) => x !== id) }));
  }, []);

  if (editingId || editingMember) {
    return (
      <div className="flex flex-col px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{editingId ? "Edit Member" : "Add Member"}</h1>
            <p className="text-xs text-muted-foreground">Reference compendium entries, never duplicated.</p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="touch-target rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-150 hover:bg-accent active:scale-90"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <section className="flex flex-col gap-3">
            <SectionTitle>Identity</SectionTitle>
            <div className="grid grid-cols-1 gap-3">
              <Field label="Name *">
                <input
                  type="text"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="e.g. Lyra"
                  autoComplete="off"
                  className={inputClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Class *">
                  <input
                    type="text"
                    list="class-options"
                    value={draft.class}
                    onChange={(e) => setDraft((d) => ({ ...d, class: e.target.value }))}
                    placeholder="e.g. Wizard"
                    autoComplete="off"
                    className={inputClass}
                  />
                </Field>
                <Field label="Level">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={draft.level}
                    onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Race">
                  <input
                    type="text"
                    list="race-options"
                    value={draft.race}
                    onChange={(e) => setDraft((d) => ({ ...d, race: e.target.value }))}
                    placeholder="e.g. High Elf"
                    autoComplete="off"
                    className={inputClass}
                  />
                </Field>
                <Field label="Subclass">
                  <input
                    type="text"
                    value={draft.subclass}
                    onChange={(e) => setDraft((d) => ({ ...d, subclass: e.target.value }))}
                    placeholder="e.g. Evocation"
                    autoComplete="off"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
            <datalist id="class-options">
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <datalist id="race-options">
              {RACE_OPTIONS.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </section>

          <section className="flex flex-col gap-3">
            <SectionTitle>Passive Senses</SectionTitle>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Perception">
                <input
                  type="number"
                  min={0}
                  value={draft.passivePerception}
                  onChange={(e) => setDraft((d) => ({ ...d, passivePerception: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Insight">
                <input
                  type="number"
                  min={0}
                  value={draft.passiveInsight}
                  onChange={(e) => setDraft((d) => ({ ...d, passiveInsight: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Investigation">
                <input
                  type="number"
                  min={0}
                  value={draft.passiveInvestigation}
                  onChange={(e) => setDraft((d) => ({ ...d, passiveInvestigation: e.target.value }))}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <SectionTitle>Known Spells</SectionTitle>
            {draft.knownSpellCanonicalIds.length === 0 ? (
              <p className="text-xs text-muted-foreground">None</p>
            ) : (
              <div className="flex flex-col">
                {draft.knownSpellCanonicalIds.map((id) => (
                  <RefRow key={id} canonicalId={id} onRemove={handleRemoveSpell} />
                ))}
              </div>
            )}
            <AddButton label="Add Spell" onClick={() => setPicker("spell")} />
          </section>

          <section className="flex flex-col gap-3">
            <SectionTitle>Armor</SectionTitle>
            {draft.equippedArmorCanonicalId ? (() => {
              const armorId = draft.equippedArmorCanonicalId;
              const ref = entityRefFromCanonicalId(armorId);
              if (!ref) return <p className="text-xs text-muted-foreground">None</p>;
              return (
                <EntityReferenceRow
                  canonicalId={armorId}
                  subtitle={armorLabel(armorId) ?? ref.subtitle}
                  showBadge={false}
                  asLink={false}
                  className="rounded-lg border border-border p-3"
                  action={
                    <RowRemoveButton
                      label={`Remove ${ref.name}`}
                      onClick={() => setDraft((d) => ({ ...d, equippedArmorCanonicalId: undefined }))}
                    />
                  }
                />
              );
            })() : (
              <p className="text-xs text-muted-foreground">None</p>
            )}
            <AddButton label={draft.equippedArmorCanonicalId ? "Change Armor" : "Add Armor"} onClick={() => setPicker("armor")} />
          </section>

          <section className="flex flex-col gap-3">
            <SectionTitle>Weapons</SectionTitle>
            {draft.equippedWeaponCanonicalIds.length === 0 ? (
              <p className="text-xs text-muted-foreground">None</p>
            ) : (
              <div className="flex flex-col">
                {draft.equippedWeaponCanonicalIds.map((id) => (
                  <RefRow key={id} canonicalId={id} onRemove={handleRemoveWeapon} />
                ))}
              </div>
            )}
            <AddButton label="Add Weapon" onClick={() => setPicker("weapon")} />
          </section>

          <section className="flex flex-col gap-3">
            <SectionTitle>Magic Items</SectionTitle>
            {draft.equippedMagicItemCanonicalIds.length === 0 ? (
              <p className="text-xs text-muted-foreground">None</p>
            ) : (
              <div className="flex flex-col">
                {draft.equippedMagicItemCanonicalIds.map((id) => (
                  <RefRow key={id} canonicalId={id} onRemove={handleRemoveMagicItem} />
                ))}
              </div>
            )}
            <AddButton label="Add Magic Item" onClick={() => setPicker("magicitem")} />
          </section>

          <section className="flex flex-col gap-3">
            <SectionTitle>Notes</SectionTitle>
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              placeholder="Anything you want to remember about this character."
              rows={3}
              className={inputClass}
            />
          </section>

          {editingId && (
            <button
              type="button"
              onClick={handleDelete}
              className="touch-target rounded-lg border border-destructive/50 px-3 py-2 text-xs text-destructive transition-all duration-150 hover:bg-destructive/10 active:scale-95"
            >
              Remove Member
            </button>
          )}

          <button
            type="submit"
            disabled={!canSave}
            className="sticky bottom-4 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-95 disabled:opacity-40 disabled:hover:bg-primary"
          >
            {editingId ? "Save Changes" : "Add Member"}
          </button>
        </form>

        {picker && (
          <ReferencePicker
            title={PICKER_TITLES[picker]}
            candidates={candidates}
            onSelect={handlePickerSelect}
            onClose={() => setPicker(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Party</h1>
          <p className="text-xs text-muted-foreground">
            {party.length === 0 ? "No party members" : `${party.length} member${party.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          type="button"
          onClick={handleStartCreate}
          className="touch-target rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-95"
        >
          Add Member
        </button>
      </div>

      {party.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Your party is empty. Add a member and reference the spells, armor, weapons, and magic items they carry.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {party.map((member) => {
            const chips = memberChips(member);
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => handleEdit(member)}
                className="flex flex-col gap-2 rounded-lg border border-border p-4 text-left transition-all duration-150 hover:bg-accent/50 active:bg-accent/80 active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-foreground">{member.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {member.class}
                      {member.subclass ? ` (${member.subclass})` : ""} {"\u00B7"} Level {member.level}
                      {member.race ? ` \u00B7 ${member.race}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    Lv {member.level}
                  </span>
                </div>
                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {chips.map((chip) => (
                      <span key={chip} className="rounded-full border border-border bg-accent/50 px-2 py-0.5 text-xs text-muted-foreground">
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
