export type EntityCategory =
  "spell" | "condition" | "action" | "equipment" | "monster" | "npc" | "character";

export type { CompendiumCategory } from "./compendium";

export interface Entity {
  readonly id: string;
  readonly category: EntityCategory;
  readonly name: string;
}

export interface SearchResult {
  readonly entity: Entity;
  readonly score: number;
}

export type UserRole = "dm" | "player";

export interface Campaign {
  readonly id: string;
  readonly name: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
}
