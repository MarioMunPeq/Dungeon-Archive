import type { RelatedIndex, MutableRelatedIndex } from "../../src/types/relationships";
import type { ContentBlock } from "../../src/types/content-block";
import type {
  CompendiumEntry,
  Spell,
  Monster,
  Equipment,
  Condition,
  Action,
} from "../../src/types/compendium";

const SCHOOL_NAMES: Record<string, string> = {
  A: "Abjuration",
  C: "Conjuration",
  D: "Divination",
  E: "Enchantment",
  I: "Illusion",
  N: "Necromancy",
  T: "Transmutation",
  V: "Evocation",
};

const DAMAGE_KEYWORDS = [
  "acid",
  "bludgeoning",
  "cold",
  "fire",
  "force",
  "lightning",
  "necrotic",
  "piercing",
  "poison",
  "psychic",
  "radiant",
  "slashing",
  "thunder",
] as const;

const THEMATIC_KEYWORDS = [
  "area",
  "attack",
  "buff",
  "charm",
  "control",
  "damage",
  "debuff",
  "fear",
  "healing",
  "illusion",
  "movement",
  "summon",
  "teleport",
] as const;

const MAX_RELATED = 8;

function parseCr(cr: string): number {
  const trimmed = cr.trim();
  if (trimmed === "0") return 0;
  const fracMatch = trimmed.match(/^(\d+)\/(\d+)$/);
  if (fracMatch) {
    return Number(fracMatch[1]) / Number(fracMatch[2]);
  }
  const num = Number(trimmed);
  return isNaN(num) ? 0 : num;
}

function crTier(cr: string): string {
  const val = parseCr(cr);
  if (val <= 4) return "Low";
  if (val <= 10) return "Mid";
  if (val <= 16) return "High";
  return "Epic";
}

function textFromBlocks(blocks: readonly ContentBlock[]): string {
  let text = "";
  for (const block of blocks) {
    switch (block.type) {
      case "paragraph":
      case "header":
        text += ` ${block.text}`;
        break;
      case "entries":
        text += ` ${textFromBlocks(block.blocks)}`;
        break;
      case "list":
        for (const item of block.items) {
          if (typeof item === "string") {
            text += ` ${item}`;
          } else {
            text += ` ${textFromBlocks([item])}`;
          }
        }
        break;
      case "table":
        if (block.caption) text += ` ${block.caption}`;
        break;
      case "quote":
        text += ` ${textFromBlocks(block.blocks)}`;
        break;
      case "inset":
        text += ` ${textFromBlocks(block.blocks)}`;
        break;
      case "reference":
        if (block.label) text += ` ${block.label}`;
        break;
      case "dice":
        if (block.label) text += ` ${block.label}`;
        break;
      case "link":
        text += ` ${block.text}`;
        break;
    }
  }
  return text;
}

function extractKeywords(text: string, keywords: readonly string[]): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const kw of keywords) {
    const regex = new RegExp(`\\b${kw}`, "i");
    if (regex.test(lower)) {
      found.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }
  return found;
}

function extractSpellTags(entity: Spell): string[] {
  const tags: string[] = [];
  const schoolName = SCHOOL_NAMES[entity.school];
  if (schoolName) tags.push(schoolName);
  tags.push(`Level ${entity.level}`);
  if (entity.ritual) tags.push("Ritual");
  if (entity.concentration) tags.push("Concentration");
  for (const cls of entity.classes) {
    tags.push(cls);
  }
  const bodyText = textFromBlocks(entity.description);
  tags.push(...extractKeywords(bodyText, DAMAGE_KEYWORDS));
  tags.push(...extractKeywords(bodyText, THEMATIC_KEYWORDS));
  return tags;
}

function extractMonsterTags(entity: Monster): string[] {
  const tags: string[] = [];
  tags.push(entity.monsterType);
  for (const tag of entity.tags) {
    tags.push(tag);
  }
  tags.push(crTier(entity.challengeRating));
  tags.push(entity.size);
  const bodyText = textFromBlocks(entity.description);
  tags.push(...extractKeywords(bodyText, DAMAGE_KEYWORDS));
  tags.push(...extractKeywords(bodyText, THEMATIC_KEYWORDS));
  return tags;
}

function extractEquipmentTags(entity: Equipment): string[] {
  const tags: string[] = [];
  tags.push(entity.type);
  if (entity.damageType) tags.push(entity.damageType);
  if (entity.properties) {
    for (const prop of entity.properties) {
      tags.push(prop);
    }
  }
  return tags;
}

function extractConditionTags(entity: Condition): string[] {
  return [entity.name];
}

function extractActionTags(entity: Action): string[] {
  const tags: string[] = [];
  tags.push(entity.actionType);
  const bodyText = textFromBlocks(entity.description);
  tags.push(...extractKeywords(bodyText, DAMAGE_KEYWORDS));
  tags.push(...extractKeywords(bodyText, THEMATIC_KEYWORDS));
  return tags;
}

function extractTags(entity: CompendiumEntry): string[] {
  switch (entity.category) {
    case "spell":
      return extractSpellTags(entity as Spell);
    case "monster":
      return extractMonsterTags(entity as Monster);
    case "equipment":
      return extractEquipmentTags(entity as Equipment);
    case "condition":
      return extractConditionTags(entity as Condition);
    case "action":
      return extractActionTags(entity as Action);
  }
}

function spellScoring(a: Spell, b: Spell, tagsA: string[], tagsB: string[]): number {
  let score = 0;
  if (a.school === b.school) score += 4;
  const lvlDiff = Math.abs(a.level - b.level);
  if (lvlDiff === 0) score += 2;
  else if (lvlDiff === 1) score += 1;
  const sharedClasses = a.classes.filter((c) => b.classes.includes(c));
  score += Math.min(sharedClasses.length * 2, 4);
  const sharedTags = tagsA.filter((t) => t !== schoolName(a.school) && tagsB.includes(t));
  score += Math.min(sharedTags.length, 3);
  if (a.source === b.source) score += 1;
  return score;
}

function monsterScoring(a: Monster, b: Monster, tagsA: string[], tagsB: string[]): number {
  let score = 0;
  if (a.monsterType === b.monsterType) score += 4;
  if (a.challengeRating === b.challengeRating) score += 3;
  else {
    const crDiff = Math.abs(parseCr(a.challengeRating) - parseCr(b.challengeRating));
    if (crDiff <= 1) score += 2;
    else if (crDiff <= 2) score += 1;
  }
  const familyA = a.name.split(" ")[0];
  const familyB = b.name.split(" ")[0];
  if (familyA && familyB && familyA === familyB) score += 2;
  const sharedTags = tagsA.filter((t) => tagsB.includes(t));
  score += Math.min(sharedTags.length, 3);
  if (a.source === b.source) score += 1;
  return score;
}

function equipmentScoring(a: Equipment, b: Equipment, _tagsA: string[], _tagsB: string[]): number {
  let score = 0;
  if (a.type === b.type) score += 4;
  if (a.damageType && b.damageType && a.damageType === b.damageType) score += 2;
  if (a.source === b.source) score += 1;
  return score;
}

function conditionScoring(a: Condition, b: Condition, _tagsA: string[], _tagsB: string[]): number {
  if (a.source === b.source) return 2;
  return 0;
}

function schoolName(code: string): string {
  return SCHOOL_NAMES[code] ?? code;
}

function computeSimilarity(
  a: CompendiumEntry,
  b: CompendiumEntry,
  tagsMap: Map<string, string[]>,
): number {
  if (a.category !== b.category) return 0;
  if (a.canonicalId === b.canonicalId) return 0;

  const tagsA = tagsMap.get(a.canonicalId) ?? [];
  const tagsB = tagsMap.get(b.canonicalId) ?? [];

  switch (a.category) {
    case "spell":
      return spellScoring(a as Spell, b as Spell, tagsA, tagsB);
    case "monster":
      return monsterScoring(a as Monster, b as Monster, tagsA, tagsB);
    case "equipment":
      return equipmentScoring(a as Equipment, b as Equipment, tagsA, tagsB);
    case "condition":
      return conditionScoring(a as Condition, b as Condition, tagsA, tagsB);
    case "action":
      return 0;
  }
}

function topN(
  scores: Map<string, Map<string, number>>,
  canonicalId: string,
  max: number,
): string[] {
  const entityScores = scores.get(canonicalId);
  if (!entityScores || entityScores.size === 0) return [];

  const sorted = [...entityScores.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });

  return sorted.slice(0, max).map(([id]) => id);
}

function findReferencesInBlocks(
  blocks: readonly ContentBlock[],
  sourceId: string,
  refs: Map<string, string[]>,
): void {
  for (const block of blocks) {
    switch (block.type) {
      case "reference": {
        const existing = refs.get(block.target) ?? [];
        if (!existing.includes(sourceId)) {
          existing.push(sourceId);
          refs.set(block.target, existing);
        }
        break;
      }
      case "entries":
        findReferencesInBlocks(block.blocks, sourceId, refs);
        break;
      case "quote":
        findReferencesInBlocks(block.blocks, sourceId, refs);
        break;
      case "inset":
        findReferencesInBlocks(block.blocks, sourceId, refs);
        break;
      case "list":
        for (const item of block.items) {
          if (typeof item !== "string") {
            findReferencesInBlocks([item], sourceId, refs);
          }
        }
        break;
    }
  }
}

function collectDescriptionBlocks(entity: CompendiumEntry): readonly ContentBlock[] {
  const blocks: ContentBlock[] = [];
  switch (entity.category) {
    case "spell": {
      const e = entity as Spell;
      blocks.push(...e.description);
      if (e.higherLevels) blocks.push(...e.higherLevels);
      break;
    }
    case "monster": {
      const e = entity as Monster;
      blocks.push(...e.description);
      blocks.push(...e.traits);
      blocks.push(...e.actions);
      blocks.push(...e.reactions);
      blocks.push(...e.legendaryActions);
      break;
    }
    case "condition":
    case "equipment":
    case "action": {
      const e = entity as Condition | Equipment | Action;
      blocks.push(...e.description);
      break;
    }
  }
  return blocks;
}

function buildReverseReferences(
  entities: readonly CompendiumEntry[],
  refs: Map<string, string[]>,
): void {
  for (const entity of entities) {
    const blocks = collectDescriptionBlocks(entity);
    findReferencesInBlocks(blocks, entity.canonicalId, refs);
  }
}

export function generateRelatedIndex(entities: readonly CompendiumEntry[]): RelatedIndex {
  const tagMap = new Map<string, string[]>();
  for (const entity of entities) {
    tagMap.set(entity.canonicalId, extractTags(entity));
  }

  const similarityScores = new Map<string, Map<string, number>>();

  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const a = entities[i]!;
      const b = entities[j]!;
      const score = computeSimilarity(a, b, tagMap);
      if (score > 0) {
        let mapA = similarityScores.get(a.canonicalId);
        if (!mapA) {
          mapA = new Map();
          similarityScores.set(a.canonicalId, mapA);
        }
        let mapB = similarityScores.get(b.canonicalId);
        if (!mapB) {
          mapB = new Map();
          similarityScores.set(b.canonicalId, mapB);
        }
        mapA.set(b.canonicalId, score);
        mapB.set(a.canonicalId, score);
      }
    }
  }

  const reverseRefs = new Map<string, string[]>();
  buildReverseReferences(entities, reverseRefs);

  const index: MutableRelatedIndex = {};

  for (const entity of entities) {
    const cid = entity.canonicalId;
    const related = topN(similarityScores, cid, MAX_RELATED);
    const tags = tagMap.get(cid) ?? [];
    const references = reverseRefs.get(cid) ?? [];

    index[cid] = { tags, related, references };
  }

  return index as RelatedIndex;
}
