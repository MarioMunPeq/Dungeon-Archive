export interface ParagraphBlock {
  readonly type: "paragraph";
  readonly text: string;
}

export interface HeaderBlock {
  readonly type: "header";
  readonly text: string;
  readonly level?: number;
}

export interface EntriesBlock {
  readonly type: "entries";
  readonly name?: string;
  readonly blocks: readonly ContentBlock[];
}

export interface ListBlock {
  readonly type: "list";
  readonly items: readonly (string | ContentBlock)[];
  readonly style?: string;
}

export interface TableCell {
  readonly text: string;
  readonly align?: "left" | "center" | "right";
}

export interface TableBlock {
  readonly type: "table";
  readonly headers: readonly TableCell[];
  readonly rows: readonly (readonly TableCell[])[];
  readonly caption?: string;
}

export interface QuoteBlock {
  readonly type: "quote";
  readonly blocks: readonly ContentBlock[];
  readonly by?: string;
}

export interface InsetBlock {
  readonly type: "inset";
  readonly blocks: readonly ContentBlock[];
}

export interface SeparatorBlock {
  readonly type: "separator";
}

export interface ReferenceBlock {
  readonly type: "reference";
  readonly target: string;
  readonly label?: string;
}

export interface DiceBlock {
  readonly type: "dice";
  readonly formula: string;
  readonly label?: string;
}

export interface LinkBlock {
  readonly type: "link";
  readonly href: string;
  readonly text: string;
}

export interface ImageBlock {
  readonly type: "image";
  readonly src: string;
  readonly alt?: string;
  readonly width?: number;
  readonly height?: number;
}

export type ContentBlock =
  | ParagraphBlock
  | HeaderBlock
  | EntriesBlock
  | ListBlock
  | TableBlock
  | QuoteBlock
  | InsetBlock
  | SeparatorBlock
  | ReferenceBlock
  | DiceBlock
  | LinkBlock
  | ImageBlock;
